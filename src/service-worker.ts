/// <reference lib="webworker" />
/* eslint-disable no-restricted-globals */

import { clientsClaim } from 'workbox-core'
import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import Database from './storage/Database'
import PostMessageType from './types/service_worker/PostMessageType'
import PostMessageData from './types/service_worker/PostMessageData'
import Utils from './utils/Utils'

declare const self: ServiceWorkerGlobalScope

clientsClaim()

// Precache all of the assets generated in build process.
precacheAndRoute(self.__WB_MANIFEST)

//#region SHELL-STYLE ROUTING
const fileExtensionRegexp = new RegExp('/[^/?]+\\.[^/]+$')
registerRoute(
  // Return false to exempt requests from being fulfilled by index.html.
  ({ request, url }: { request: Request; url: URL }) => {
    // If this isn't a navigation, skip.
    if (request.mode !== 'navigate') {
      return false
    }

    // If this is a URL that starts with /_, skip.
    if (url.pathname.startsWith('/_')) {
      return false
    }

    // If this looks like a URL for a resource, because it contains
    // a file extension, skip.
    if (url.pathname.match(fileExtensionRegexp)) {
      return false
    }

    // Return true to signal that we want to use the handler.
    return true
  },
  createHandlerBoundToURL(process.env.PUBLIC_URL + '/index.html')
)
//#endregion

//#region SKIP WAITING
//This allows the web app to trigger skipWaiting via registration.waiting.postMessage({type: 'SKIP_WAITING'})
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})
//#endregion

//#region POST MESSAGE
const tabClosedPostMessage = async (event: ExtendableMessageEvent) => {
  const table = Database.tab
  const receivedId = event.data.message
  if (Utils.isNotEmpty(receivedId)) {
    await table.where('id').equals(receivedId).delete()
    const ids = await table.toArray()
    if (ids.length > 0) {
      const firstId = ids.sort((a,b) => a > b ? 1 : -1)[0]
      const clients = await self.clients.matchAll()
      if (clients.length > 0) {
        const data: PostMessageData<number> = {
          type: PostMessageType.CHANGE_MAIN_TAB,
          message: firstId.id!
        }
        clients.forEach(client => client.postMessage(data))
      } else {
        await table.clear()
      }
    }
  }
}

self.addEventListener('message', async (event) => {
  if (event.data && event.data.type && event.data.type === PostMessageType.TAB_CLOSED) {
    await tabClosedPostMessage(event)
  }
})
//#endregion