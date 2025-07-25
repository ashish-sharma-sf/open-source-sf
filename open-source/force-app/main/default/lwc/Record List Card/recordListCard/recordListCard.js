/**
 * @description       : Custom Lightning Web Component for displaying a list of records in a card format.
 * @author            : Ashish Sharma
**/
import { LightningElement, api } from 'lwc';

export default class RecordListCard extends LightningElement {
    @api iconName = 'standard:account';
    @api headerLabel = '';
    @api customActions = [];
    @api records = [];
    @api columns = [];
    @api sortedBy = '';
    @api showRowNumbers = false;
    @api disableColumnResize = false;
    @api showDefaultActions = false;

    isTableVisible = true;

    get recordCount() {
        return this.records.length;
    }

    get showNoData() {
        return this.records.length === 0;
    }

    get emptyStateMessage() {
        return `No ${this.headerLabel.toLowerCase()}`;
    }

    get computedIconClass() {
        return this.showRowNumbers
            ? 'slds-icon_container'
            : 'custom-icon-custom19 slds-icon_container';
    }

    get showSortedText() {
        return this.sortedBy ? `Sorted by ${this.sortedBy}` : '';
    }

    handleActionClick(event) {
        this.dispatchEvent(
            new CustomEvent('actionclick', {
                detail: event.target.name,
            })
        );
    }

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        this.dispatchEvent(
            new CustomEvent('rowaction', {
                detail: {
                    actionName,
                    row,
                },
            })
        );
    }

    resetTableColumns() {
        this.isTableVisible = false;
        setTimeout(() => {
            this.isTableVisible = true;
        }, 0);
    }

    handleRefresh() {
        this.dispatchEvent(new CustomEvent('refresh'));
    }

    handleMenuKeyPress() {
        // Placeholder for keyboard accessibility if needed
    }

    get headerRowClass() {
        return 'slds-page-header__row slds-page-header__row--meta';
    }
}
