import BaseSynchronizableService from "./BaseSynchronizableService"

export interface SyncTreeNode {
    service: BaseSynchronizableService
    dependencies: SyncTreeNode[]
}
  
class SyncTree {
    root: SyncTreeNode[]
  
    constructor() {
      this.root = []
    }
  
    add = (service: BaseSynchronizableService) => {
      const existentNode = this.findNode(service, this.root)
      const dependencies = service.getDependencies()
      if (existentNode && dependencies.length > 0) {
        this.addDependencies(existentNode, dependencies)
      } else {
        this.addNew(service)
      }
    }

    private addDependencies = (existentNode: SyncTreeNode, dependencies: BaseSynchronizableService[]) => {  
        dependencies.forEach(dependency => {
          const dependencyNode = this.findNode(dependency, this.root)
  
          if (dependencyNode) {
            this.removeNodeFromRoot(dependencyNode.service)
            existentNode.dependencies.push(dependencyNode)
          } else {
            existentNode.dependencies.push({
                service: dependency,
                dependencies: []
            })
          }
        })
    }
  
    private addNew = (service: BaseSynchronizableService) => {
      const dependencies = service.getDependencies()

      if (dependencies.length > 0) {
        const dependencyNodes: SyncTreeNode[] = []
  
        dependencies.forEach(dependency => {
          const dependencyNode = this.findNode(dependency, this.root)
  
          if (dependencyNode) {
            this.removeNodeFromRoot(dependencyNode.service)
            dependencyNodes.push(dependencyNode)
          } else {
            dependencyNodes.push({
                service: dependency,
                dependencies: []
            })
          }
        })
  
        this.addNodeOnRoot(service, dependencyNodes)
      } else {
        this.addNodeOnRoot(service)
      }
    }
  
    private addNodeOnRoot = (service: BaseSynchronizableService, dependencies?: SyncTreeNode[]) => {
      this.root.push({
        dependencies: dependencies ? dependencies : [],
        service: service
      })
    }
  
    private findNode = (service: BaseSynchronizableService, nodes: SyncTreeNode[]): SyncTreeNode | undefined => {
      const childrens: SyncTreeNode[] = []
    
      const serviceNode = nodes.find(node => {
        if (Object.is(node.service, service)) {
          return true
        }
    
        childrens.push(...node.dependencies)
        return false
      })
    
      if (serviceNode) {
        return serviceNode
      }
    
      return childrens.length > 0 ? this.findNode(service, childrens) : undefined
    }

    private removeNodeFromRoot = (service: BaseSynchronizableService) => {
        const index = this.root.findIndex(node => node.service === service)
        if (index >= 0) {
          this.root.splice(index, 1)
        }
    }
}

export default SyncTree