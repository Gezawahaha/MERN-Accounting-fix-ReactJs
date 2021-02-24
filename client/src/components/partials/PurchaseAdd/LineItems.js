import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

import LineItem from './LineItem'

import { MdAddCircle as AddIcon } from 'react-icons/md'
import styles from './LineItems.module.scss'


class LineItems extends Component {

  handleDragEnd = (result) => {

    if (!result.destination) return

    // helper function to reorder result (src: react-beautiful-dnd docs)
    const reorder = (list, startIndex, endIndex) => {
      const result = Array.from(list)
      const [removed] = result.splice(startIndex, 1)
      result.splice(endIndex, 0, removed)
      return result
    }

    // perform reorder
    const lineItems = reorder(
      this.props.items,
      result.source.index,
      result.destination.index
    )

    // call parent handler with new state representation
    this.props.reorderHandler(lineItems)

  }

  render = () => {

    const {items, addHandler, reorderHandler, ...functions} = this.props

    return (
      <form>

        <div className={styles.lineItems}>
          <div className={`${styles.gridTable}`}>

            <div className={`${styles.row} ${styles.header}`}>
              <div>#</div>
              <div>Item</div>
              <div>Description</div>
              <div>Qty</div>
              <div>Price</div>
              <div>Total</div>
              <div></div>
            </div>

            <div>
              {this.props.items.map((item, i) => (
                <LineItem
                  style={{color: 'red'}}
                  key={i + item.id} index={i} name={item.name}
                  item_desc={item.item_desc} qty={item.qty} price={item.price} total_price={item.total_price}
                  {...functions}
                />
              ))}
            </div>
          </div>

          <div className={styles.addItem}>
            <button type="button" onClick={addHandler}><AddIcon size="1.25em" className={styles.addIcon} /> Add Item</button>
          </div>

        </div>
      </form>

    )
  }
}

export default LineItems

LineItems.propTypes = {
  items: PropTypes.array.isRequired,
  currencyFormatter: PropTypes.func.isRequired,
  addHandler: PropTypes.func.isRequired,
  changeHandler: PropTypes.func.isRequired,
  focusHandler: PropTypes.func.isRequired,
  deleteHandler: PropTypes.func.isRequired,
  reorderHandler: PropTypes.func.isRequired,
}


