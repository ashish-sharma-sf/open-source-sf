/**
 * @description       : A Lightning Web Component to display a hierarchical tree structure
 * @author            : Ashish Sharma
 **/

import { LightningElement, api, track } from 'lwc';

const RIGHTICONHTML = `<svg class="slds-button__icon slds-button__icon_small">
    <use xlink:href="/_slds/icons/utility-sprite/svg/symbols.svg#chevronright"></use>
</svg>`;

const DOWNICONHTML = `<svg class="slds-button__icon slds-button__icon_small">
    <use xlink:href="/_slds/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
</svg>`;

export default class DataTree extends LightningElement {
    @track _treeItems = [];
	@api hideCheckbox = false;
	_expand = false;

    /**
     * Controls whether the entire tree is expanded or collapsed.
     * Expanding or collapsing triggers tree-wide visibility updates.
     */
	@api
	set expand(value) {
		this._expand = value;
		if (this._expand) {
			this.expandAllNodes(this._treeItems);
		} else {
			this.collapseAllNodes(this._treeItems);
		}
	}

	get expand() {
		return this._expand;
	}

    /**
     * Input tree data. Creates a deep clone to avoid direct mutations.
     * After setting, applies necessary CSS classes and properties.
     */
	@api
	set treeItems(value) {
		if (!value) return;

		const cloned = value.map((item) => this.cloneTreeData(item));
		this._treeItems = cloned;

		this.applyClassesIfReady();
	}

	get treeItems() {
		return this._treeItems;
	}

    /**
     * CSS margin class applied for nested tree levels.
     * Changing this triggers re-application of classes.
     */
	@api
	get marginClass() {
		return this._marginClass;
	}

	set marginClass(value) {
		this._marginClass = value || '';
		this.applyClassesIfReady();
	}

	selectedValues = new Set();
	sldsButtonClass = 'slds-button slds-button_icon slds-button_icon-x-small slds-m-right_x-small';

    /**
     * Determines if checkboxes should be shown for node selection.
     */
	get showCheckbox() {
		return !this.hideCheckbox;
	}

    /**
     * Recursively clones tree data to prevent mutation of original data.
     */
	cloneTreeData(item) {
		return {
			...item,
			children: item.children?.map((child) => this.cloneTreeData(child)) || [],
		};
	}

	/**
     * Applies CSS classes and initial properties to tree nodes if marginClass and treeItems are set.
     */
	applyClassesIfReady() {
		if (this._marginClass !== '' && Array.isArray(this._treeItems) && this._treeItems.length > 0) {
			this.applyNodeClassesRecursively();
		}
	}

	/**
     * Recursively assigns CSS classes and metadata flags for each node in the tree.
     */
	applyNodeClassesRecursively(items = this._treeItems, level = 0) {
		if (!Array.isArray(items)) return;

		items.forEach((item) => {
			const hasExpandableChildren = item.children?.length > 0 || item.hasChildren;
			item.containerClass = this.marginClass;
			item.buttonClass = hasExpandableChildren ? this.sldsButtonClass : 'hideBtn ' + this.sldsButtonClass;

            // Default showChildNodes to true if not explicitly set
			item.showChildNodes = item.hasOwnProperty('showChildNodes') ? item.showChildNodes : true;

            // Flag indicating lazy loading
			item.lazyLoad = item.lazyLoad || false;

            // Flag to indicate if node represents a URL (for special rendering)
			item.isUrl = item.typeAttributes && item.typeAttributes.type === 'url';

			if (item.children && item.children.length > 0) {
				this.applyNodeClassesRecursively(item.children, level + 1);
			}
		});
	}

	/**
     * Returns the margin class for the next nested level based on current class.
     * Provides incremental indentation styles for nested nodes.
     */
	computeNextMarginClass(current) {
		const marginClasses = ['slds-m-left--large', 'slds-m-left--xx-large', 'margin-nested', 'margin-nested-5th', 'margin-nested-nth'];
		const currentIndex = marginClasses.indexOf(current);
		return marginClasses[currentIndex + 1] || 'margin-nested-nth';
	}

    /**
     * Lifecycle hook called after every render.
     * Ensures the tree is expanded if the expand property is true.
     */
	renderedCallback() {
		if (this._treeItems && this.expand) {
			this.expandAllNodes(this._treeItems);
		}
	}

	/**
     * Expands all nodes in the tree.
     */
	expandAllNodes(treeItems) {
		treeItems.forEach((item) => this.toggleNodeChildrenVisibility(item.id, true));
	}

	/**
     * Collapses all nodes in the tree.
     */
	collapseAllNodes(treeItems) {
		treeItems.forEach((item) => this.toggleNodeChildrenVisibility(item.id, false));
	}

	/**
     * Toggles visibility of child nodes for a specific node.
     * Updates button icon accordingly.
     */
	toggleNodeChildrenVisibility(nodeId, forceExpand) {
		const container = this.template.querySelector(`[data-id="${nodeId}"]`);
		const buttonElement = this.template.querySelector(`button[name="${nodeId}"]`);

		if (!container || !buttonElement) return;

		const isCurrentlyHidden = container.classList.contains('slds-hide');

		if (forceExpand || (!forceExpand && isCurrentlyHidden)) {
			container.classList.remove('slds-hide');
			container.classList.add('slds-show');
			buttonElement.innerHTML = DOWNICONHTML;
		} else {
			container.classList.remove('slds-show');
			container.classList.add('slds-hide');
			buttonElement.innerHTML = RIGHTICONHTML;
		}
	}

	/**
     * Handles user click on expand/collapse button.
     * Supports lazy loading by dispatching 'expandnode' event when needed.
     */
	handleToggleNodeExpandCollapse(event) {
		const nodeId = event.currentTarget.name;
		const node = this.findNodeByIdRecursive(this._treeItems, nodeId);
		if (!node) return;

		const listElem = this.template.querySelector(`[data-id="${nodeId}"]`);
		const isHidden = listElem?.classList.contains('slds-hide');

		if (isHidden && node.lazyLoad) {
			this.dispatchEvent(
				new CustomEvent('expandnode', {
					detail: { nodeId },
					bubbles: true,
					composed: true,
				})
			);
		}
		this.toggleNodeChildrenVisibility(nodeId);
	}

	handleExpandNode() {}

	/**
     * Handles checkbox selection changes.
     * Updates internal selection state and dispatches event with updated selection.
     */
	handleCheckboxChange(event) {
		const value = event.target.name;

		if (event.target.checked) {
			this.selectedValues.add(value);
		} else {
			this.selectedValues.delete(value);
		}

		// Dispatch event with selected values
		this.dispatchEvent(
			new CustomEvent('selectunselect', {
				detail: {
					selectedValues: [...this.selectedValues],
					removedItem: event.target.checked ? null : value,
				},
				bubbles: true,
				composed: true,
			})
		);
	}

	/**
     * Updates selection state based on child component events.
     * Adds or removes selected values accordingly.
     */
	handleChildSelectionEvent(event) {
		event.detail.selectedValues.forEach((value) => this.selectedValues.add(value));
		if (event.detail.removedItem) {
			this.selectedValues.delete(event.detail.removedItem);
		}
	}

	/**
     * Searches the tree recursively for a node matching the given ID.
     * @param {Array} nodes - List of tree nodes.
     * @param {string} id - ID of the node to find.
     * @returns {Object|null} Node if found, else null.
     */
	findNodeByIdRecursive(nodes, id) {
		for (const node of nodes) {
			if (node.id === id) return node;
			if (node.children?.length) {
				const found = this.findNodeByIdRecursive(node.children, id);
				if (found) return found;
			}
		}
		return null;
	}

	/**
     * Handles click event on a node's label/button.
     * Dispatches 'nodeclick' event with node details.
     */
	handleNodeLabelClick(event) {
		const node = this.findNodeByIdRecursive(this._treeItems, event.target.value);

		// Dispatch event on click
		this.dispatchEvent(
			new CustomEvent('nodeclick', {
				detail: {
					node: { id: node.id, nodeName: node.nodeName, children: node.children, isSelected: node.isSelected },
				},
				bubbles: true,
				composed: true,
			})
		);
	}

	/**
     * Computes margin class for the next nested level.
     */
	get nextMarginClass() {
		return this.computeNextMarginClass(this.marginClass);
	}
}