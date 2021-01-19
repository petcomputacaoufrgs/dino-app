import SynchronizableService from "./SynchronizableService"

export interface SyncTreeNode {
    service: SynchronizableService
    dependencies: SyncTreeNode[]
    dependents: SyncTreeNode[]
}
  
class SyncTree {
    nodes: SyncTreeNode[]
    saveRoot: SyncTreeNode[]
    deleteRoot: SyncTreeNode[]

    constructor() {
      this.nodes = []
      this.saveRoot = []
      this.deleteRoot = []
    }
  
    add = (service: SynchronizableService) => {
      const node = this.findNode(service)

      if (node) {
        this.addDependencies(node)
      } else {
        this.addNew(service)
      }
    }

    private addNew = (service: SynchronizableService) => {
        const newNode = this.createNode(service)
  
        this.addNodeOnSaveRoot(newNode)

        this.addDependencies(newNode) 

        this.addNodeOnNodeList(newNode)
    }

    private addDependencies = (node: SyncTreeNode) => {  
        const dependencies = node.service.getSyncDependencies()

        if (dependencies.length > 0) {
          this.removeNodeFromDeleteRoot(node)
        } else {
          this.addNodeOnDeleteRoot(node)
        }

        dependencies.forEach(dependencyService => {
          const dependencyNode = this.findNode(dependencyService)

          if (dependencyNode) {
            this.removeNodeFromSaveRoot(dependencyNode)
            dependencyNode.dependents.push(node)
            node.dependencies.push(dependencyNode)
          } else {
            const newNode = this.createNode(dependencyService)
            newNode.dependents.push(node)
            node.dependencies.push(newNode)
            this.addNodeOnNodeList(newNode)
          }
        })
    }

    private createNode = (service: SynchronizableService): SyncTreeNode => {
      return {
        dependencies: [],
        dependents: [],
        service: service
      }
    }
  
    private addNodeOnSaveRoot = (node: SyncTreeNode) => {
      this.saveRoot.push(node)
    }

    private addNodeOnDeleteRoot = (newNode: SyncTreeNode) => {
      this.deleteRoot.push(newNode)
    }

    private addNodeOnNodeList = (node: SyncTreeNode) => {
      this.nodes.push(node)
    }
  
    private findNode = (service: SynchronizableService): SyncTreeNode | undefined => {
      return this.nodes.find(node => this.areEqual(node.service, service))
    }

    private removeNodeFromSaveRoot = (nodeToRemove: SyncTreeNode) => {
      this.removeNodeFromList(this.saveRoot, nodeToRemove)
    }

    private removeNodeFromDeleteRoot = (nodeToRemove: SyncTreeNode) => {
      this.removeNodeFromList(this.deleteRoot, nodeToRemove)
    }

    private removeNodeFromList = (list: SyncTreeNode[], node: SyncTreeNode) => {
      const index = list.findIndex(listNode => listNode.service === node.service)
      if (index >= 0) {
        list.splice(index, 1)
      }
    }

    private areEqual = (serviceA: SynchronizableService, serviceB: SynchronizableService): boolean => {
      return Object.is(serviceA, serviceB)
    }
}

export default SyncTree