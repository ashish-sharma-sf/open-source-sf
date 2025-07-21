/** 
  * @description       : A Lightning Web Component to use data tree
  * @author            : Ashish Sharma
 **/
import { LightningElement, track } from 'lwc';

export default class DemoDataTree extends LightningElement {
    @track treeData = [
        {
            id: '1',
            nodeName: 'Root Node 1',
            isSelected: false,
            typeAttributes: { icon: 'utility:folder', iconSize: 'small' },
            children: [
                {
                    id: '1-1',
                    nodeName: 'Child Node 1',
                    isSelected: false,
                    typeAttributes: { icon: 'utility:document', iconSize: 'x-small' },
                    children: []
                }
            ]
        },
        {
            id: '2',
            nodeName: 'Root Node 2 (URL)',
            isSelected: false,
            typeAttributes: { type: 'url', icon: 'utility:link', iconSize: 'small' },
            isUrl: true,
            children: []
        }
    ];

    // Handle checkbox select/unselect events from the tree
    handleSelectUnselect(event) {
        console.log('Selected values:', event.detail.selectedValues);
    }

    // Handle node click event (e.g. URL nodes)
    handleNodeClick(event) {
        const clickedNode = event.detail.node;
        console.log('Node clicked:', clickedNode);
    }

    // Handle node expand event (for lazy loading, if used)
    handleExpandNode(event) {
        const nodeId = event.detail.nodeId;
        console.log('Expand node request for:', nodeId);
        // Implement lazy loading logic here if needed
    }
}