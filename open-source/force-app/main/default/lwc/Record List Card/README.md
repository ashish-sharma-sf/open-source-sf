# 🚀 recordListCard - Reusable Lightning Web Component (LWC) for Displaying Salesforce Records

`recordListCard` is a flexible and reusable Lightning Web Component (LWC) for Salesforce developers. It displays a list of Salesforce records inside a styled SLDS card layout using `lightning-datatable`. This component is ideal for custom record pages, app pages, Experience Cloud sites, and admin utilities.

---

## ✨ Features

- 💡 Reusable LWC for displaying record lists
- 💼 Uses `lightning-datatable` with configurable columns
- 🎨 SLDS card layout with customizable icon and title
- 🔁 Supports row-level actions and header-level buttons
- ⚙️ Optional built-in actions: **Refresh**, **Reset Column Widths**
- 🧾 Graceful empty state message
- 🔌 Built with `@api` public properties for full configuration

---

## 📥 Public `@api` Properties

| Property Name         | Type     | Description |
|-----------------------|----------|-------------|
| `iconName`            | `String` | SLDS icon in header (e.g. `"standard:account"`) |
| `headerLabel`         | `String` | Title of the card |
| `records`             | `Array`  | List of records to display |
| `columns`             | `Array`  | `lightning-datatable` column definitions |
| `customActions`       | `Array`  | Optional buttons (objects with `name`, `label`, `iconName`) |
| `sortedBy`            | `String` | Field name shown as sorted |
| `showRowNumbers`      | `Boolean`| Shows row numbers if true |
| `disableColumnResize` | `Boolean`| Disables resizing of columns |
| `showDefaultActions`  | `Boolean`| Shows Refresh and Settings menu |

---

## ⚡ Events

| Event Name     | Fired When...                         | `event.detail`            |
|----------------|----------------------------------------|----------------------------|
| `actionclick`  | A header button is clicked             | `String` (action name)     |
| `rowaction`    | A row-level action is triggered        | `{ actionName, row }`      |
| `refresh`      | Refresh icon is clicked                | —                          |

---

## 📦 Example Usage in a Parent LWC

Refer recordListCardDemo lwc component
