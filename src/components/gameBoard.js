import React, {
  Component
} from 'react';
import {
  generateGrid,
  retrieveNextGeneration
} from '../gameOfLife/gameOfLife'

class GameBoard extends Component {

  /*
  Component constructor
  */
  constructor() {
    // Initializing component state
    this.state = {
      board: generateGrid(40, 40),
    };

    // Starting game
    this.nextStep()
  }

  /*
   Executing next step of game 
  */
  nextStep() {
    // Setting timeout wait before executing next step
    setTimeout(() => {
      // Executing next step
      this.setState({
        board: retrieveNextGeneration(this.state.board)
      })

      // Setting time for next step execution
      this.nextStep()
    }, 200);
  }

  /*
  Executed when the component is disconnecting from the DOM
  */
  componentWillUnmount() {
    // Since component is un mounting, remove listeners for data change
    this.crudStoreListenToken.remove()
  }

  /*
  Sorting table
  */
  _sort(key: string) {
    // Asserting sorting in descending order
    const descending = this.state.sortby === key && !this.state.descending;

    // Sorting table
    this.crudActions.sort(key, descending);

    // Saving sorting type
    this.setState({
      sortby: key,
      descending: descending,
    });
  }

  /*
  Setting cell editing mode
  */
  _showEditor(e: Event) {
    // Retrieving the cell that was clicked for entering editing mode
    const target = ((e.target: any): HTMLElement);

    // Saving editing mode cell identity
    this.setState({
      edit: {
        row: parseInt(target.dataset.row, 10),
        key: target.dataset.key,
      }
    });
  }

  /*
  Updating table data with cell data that was edited
  */
  _save(e: Event) {
    // Attempting to prevent default behaviour from any callback that will
    // be called with this event
    e.preventDefault();

    // Asserting edit mode was enabled, if not this is probably our fault
    invariant(this.state.edit, 'Messed up edit state');

    // Updating table data with cell data that was edited
    this.crudActions.updateField(
      this.state.edit.row,
      this.state.edit.key,
      this.refs.input.getValue()
    );

    // Declaring cell edit mode is disabled
    this.setState({
      edit: null,
    });
  }

  /*
  Opening requested dialog since an action was clicked
  */
  _actionClick(rowidx: number, action: string) {
    this.setState({
      dialog: {
        type: action,
        idx: rowidx
      }
    });
  }

  /*
  Retrieving delete dialog user request
  */
  _deleteConfirmationClick(action: string) {
    // Closing dialog
    this.setState({
      dialog: null
    });

    // Checking if user cancel delete request, if yes, don't do anything
    if (action === 'dismiss') {
      return;
    }

    // Retrieving dialog row(the row that was the dialog click origin) index
    let index = this._retrieve_dialog_row_origin_index()

    // Executing delete
    this.crudActions.delete(index);
  }

  /*
  Retrieving edit dialog user request
  */
  _saveDataDialog(action: string) {
    // Closing dialog
    this.setState({
      dialog: null
    });

    // Checking if user cancel edit request, if yes, don't do anything
    if (action === 'dismiss') {
      return;
    }

    // Retrieving dialog row(the row that was the dialog click origin) index
    let index = this._retrieve_dialog_row_origin_index()



    // Executing edit
    this.crudActions.updateRecord(index, this.refs.form.getData());
  }

  /*
  Rendering component
  */
  render() {
    return ( <
      div className = "Excel" > {
        this._renderTable()
      } {
        this._renderDialog()
      } <
      /div>
    );
  }

  /*
  Rendering component dialog
  */
  _renderDialog() {
    // Asserting dialog is open, if not don't render dialog
    if (!this.state.dialog) {
      return null;
    }

    // Retrieving dialog type
    const type = this.state.dialog.type;

    // Rendering requested dialog
    switch (type) {
      case 'delete':
        return this._renderDeleteDialog();
      case 'info':
        return this._renderFormDialog(true);
      case 'edit':
        return this._renderFormDialog();
      default:
        throw Error(`Unexpected dialog type ${type}`);
    }
  }

  /*
  Rendering delete dialog
  */
  _renderDeleteDialog() {
    // Retrieving dialog row(the row that was the dialog click origin) index
    let index = this._retrieve_dialog_row_origin_index()

    // Retrieving dialog row
    const row = this.state.data.get(index);

    // Asserting row retrieved successfully
    invariant(row, 'Excel._renderDeleteDialog: failed retrieving dialog row')

    // Rendering dialog
    return ( <
      Dialog modal = {
        true
      } // Setting it to be a modal dialog, meaning above body
      header = "Confirm deletion" // Setting title
      confirmLabel = "Delete" // Setting confirm button label
      onAction = {
        this._deleteConfirmationClick.bind(this)
      } // Setting the callback to call when confirm button is clicked
      >
      {
        `Are you sure you want to delete?`
      } {
        /*Setting the text to show in dialog*/
      } <
      /Dialog>
    );
  }

  /*
  Rendering form dialog
  */
  _renderFormDialog(readOnly: ? boolean) {
    // Retrieving dialog row(the row that was the dialog click origin) index
    let index = this._retrieve_dialog_row_origin_index()

    // Rendering dialog
    return ( <
      Dialog modal = {
        true
      } // Setting it to be a modal dialog, meaning above body
      header = {
        readOnly ? 'Item info' : 'Edit item'
      } // Setting title
      confirmLabel = {
        readOnly ? 'ok' : 'Save'
      } // Setting confirm button label
      hasCancel = {
        !readOnly
      } // Setting a cancel button only if the dialog is editable
      onAction = {
        this._saveDataDialog.bind(this)
      } // Setting the callback to call when confirm button is clicked
      >
      <
      Form // Creating dialog body as a form
      crudStore = {
        this.crudStore
      } // Setting form CRUD store from which to retrieve from the data
      ref = "form" // Setting reference for this form so that later it will be easily reachable
      recordId = {
        index
      } // Setting the dialog row index so that the form can access the correct table row
      readOnly = {
        !!readOnly
      }
      />                           {/ * Setting
      if the form can be edit or not * /} < /
      Dialog >
    );
  }

  /*
  Retrieving dialog row(the row that was the dialog click origin) index
  */
  _retrieve_dialog_row_origin_index(): number {
    // Retrieving dialog row(the row that was the dialog click origin) index
    const index = this.state.dialog && this.state.dialog.idx;

    // Asserting that the dialog row index retrieved successfully
    invariant(typeof index === 'number', 'Unexpected dialog state');

    return index
  }

  /*
  Rendering table
  */
  _renderTable() {
    return ( <
      table > {
        this._renderTableHead()
      } {
        /*Rendering table head*/
      } {
        this._renderTableBody()
      } {
        /*Rendering table body*/
      } <
      /table>
    );
  }

  /*
  Rendering table head
  */
  _renderTableHead() {
    return <thead >
      <
      tr > {
        // Creating each table column title from the schema
        this.state.schema.map(item => {
          // Asserting current column is set to be displayed, if not don't create a 
          // column title for it
          if (!item.show && !this.props.verbose) {
            return null;
          }

          // Retrieving column title from schema
          let title = item.label;

          // If the table is sorted by current column then add sort symbol
          if (this.state.sortby === item.id) {
            // Add sort symbol based on if the sorting is descending or otherwise
            title += this.state.descending ? ' \u2191' : ' \u2193';
          }

          // Returning column title
          return ( <
            th className = {
              `schema-${item.id}`
            } // adding class for css styling of this current header
            key = {
              item.id
            } // adding key because it is requested by react

            // adding callback for sorting the table in the event that a user clicks a column header
            onClick = {
              this._sort.bind(this, item.id)
            } > {
              title
            } {
              /*Setting column title*/
            } <
            /th>
          );
        }, this)
      } <
      th className = "ExcelNotSortable" > Actions < /th>       {/ * Adding the actions column header * /} < /
    tr > <
      /thead>
  }

  /*
  Rendering table body
  */
  _renderTableBody() {
    return <tbody onDoubleClick = {
        this._showEditor.bind(this)
      } > {
        /*Setting table body callback to be called when a cell is being clicked*/
      } {
        /*so that it can be edited*/
      } {
        /*Creating table body rows */
      } {
        this.state.data.map((row, rowidx) => {
          return (
            // Creating table row
            <
            tr key = {
              rowidx
            } > {
              /*adding key because it is requested by react*/
            } {
              // Creating row cells
              this.state.schema.map((field) => field.id).map(this._renderTableBodyCell.bind(this, row, rowidx))
            }

            {
              /*Creating actions cell */
            } <
            td className = "ExcelDataCenter" >
            <
            Actions onAction = {
              this._actionClick.bind(this, rowidx)
            }
            /> {/ * Setting callback to be called when an action is clicked * /} < /
            td > <
            /tr>
          );
        }, this)
      } <
      /tbody>
  }

  /*
  Rendering table body cell
  */
  _renderTableBodyCell(row: Object, rowidx: number, cell: string, idx: number) {
    // Retrieving table schema
    const column_schema = this.state.schema.get(idx);

    // If schema failed to be retrieved or current column is not to be displayed then 
    // don't render column
    if (!column_schema || (!column_schema.show && !this.props.verbose)) {
      return null;
    }

    // Retrieving table edit state and current cell content
    const edit = this.state.edit;
    let content = row[cell];

    // Asserting current cell is editable
    // if yes then creating cell content as an editable cell
    if (edit && edit.row === rowidx && edit.key === column_schema.id) {
      // Creating form reference string
      let refStr = `$Form_{rowidx}_${idx}`

      content = (
        /*Setting callback to be called when the user finished editing cell*/
        <
        form ref = {
          refStr
        }
        onSubmit = {
          this._save.bind(this)
        } > {
          /*Creating cell as an input cell with input reference so that it can be accessed easily*/
        } <
        FormInput getForm = {
          () => this.refs[refStr]
        }
        ref = "input" {
          ...column_schema
        }
        defaultValue = {
          content
        }
        />  < /
        form >
      );
    }
    // Otherwise, creating a readonly input cell
    else {
      content = < FormInput ref = "input" {
        ...column_schema
      }
      defaultValue = {
        content
      }
      readOnly = {
        true
      }
      /> 
    }

    // Creating cell
    return ( <
      td
      //Setting cell classes for styling
      className = {
        classNames({
          [`schema-${column_schema.id}`]: true,
          'ExcelEditable': true,
          'ExcelDataLeft': column_schema.align === 'left',
          'ExcelDataRight': column_schema.align === 'right',
          'ExcelDataCenter': column_schema.align !== 'left' && column_schema.align !== 'right',
        })
      }
      key = {
        idx
      } // adding key because it is requested by react
      data - row = {
        rowidx
      } // adding dataset row to be able to identify cell identity
      data - key = {
        column_schema.id
      } > {
        /*adding dataset column to be able to identify cell identity*/
      } {
        content
      } {
        /*adding cell content*/
      } <
      /td>
    );
  }
}

export default Excel