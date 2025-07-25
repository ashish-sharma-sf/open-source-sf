/**
 * @description       : Demo component for recordListCard
 * @author            : Ashish Sharma
**/
import { LightningElement } from 'lwc';

export default class RecordListCardDemo extends LightningElement {
    demoRecords = [
        { Id: '001', Name: 'Acme Corp', Industry: 'Manufacturing' },
        { Id: '002', Name: 'Global Media', Industry: 'Media' }
    ];

    demoColumns = [
        { label: 'Name', fieldName: 'Name', type: 'text' },
        { label: 'Industry', fieldName: 'Industry', type: 'text' }
    ];

    demoActions = [
        { name: 'new', label: 'New', iconName: 'utility:add' },
        { name: 'export', label: 'Export', iconName: 'utility:download' }
    ];

    handleCardAction(event) {
        const action = event.detail;
        console.log('Card action clicked:', action);
    }

    handleRowAction(event) {
        const { actionName, row } = event.detail;
        console.log(`Row action: ${actionName}`, row);
    }

    handleRefresh() {
        console.log('Refresh triggered');
        // Add real refresh logic here
    }
}
