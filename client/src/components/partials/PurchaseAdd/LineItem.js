import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { MdCancel as DeleteIcon } from 'react-icons/md'
import styles from './LineItem.module.scss'

import axios from "axios";
import ReactSelect from "react-select";
import '../../style/FormBiaya.css';

class LineItem extends Component {

  state = {
    BayarDari: [],
    Item:[],
    Pajak:[],
    Produk:[],
    items: [],
    Penerima: [],
    BiayaData:[],
  }

  componentDidMount(){
    this.getDataProduk();
    
    //this.mixDataItem();

  }

  // mixDataItem() {
  //    this.state.Pajak.concat();
  //   this.setState({
  //     Item: mix
  //   })
  //   console.log(mix);
  // }

  getDataPajak() {
    axios.get('/coa/main/sub/1/9')
    .then(res => {
      var mix = this.state.Produk.concat(res.data)
      this.setState({ 
        Item: mix,
        
      })
      console.log(mix);
    })
    .catch()

  }
  
  getDataProduk() {
    axios.get('/coa/main/sub/1/6')
        .then(res => {
            this.setState({ 
                Produk: res.data,
                
            })
            //console.log("Akun Biaya", res.data); 
        })
        .catch()
      this.getDataPajak();
  }


  render = () => {

    const { index, name, description, quantity, price ,expenses_amount} = this.props

    return (
      <div className={styles.lineItem}>
        <div>{index + 1}</div>
        <div>
          {/* <input name="name" type="text" value={name} onChange={this.props.changeHandler(index)} /> */}
          <ReactSelect className="col-md-12 size-select"
            label="search here"
            onChange={this.props.changeHandlerAkun(index)}
            getOptionValue={option => option.name}
            getOptionLabel={option => option.name}
            options={this.state.Item}
          />
        </div>
        <div><input name="description" type="text" value={description} onChange={this.props.changeHandler(index)} /></div>
        <div><input name="quantity" type="number" step="1" value={quantity} onChange={this.props.changeHandler(index)} onFocus={this.props.focusHandler} ></input></div>
        <div className={styles.currency}><input name="expenses_amount" type="number" step="0.01" min="0.00" max="9999999.99" value={expenses_amount} onChange={this.props.changeHandler(index)} onFocus={this.props.focusHandler} /></div>
        <div className={styles.currency}>{this.props.currencyFormatter( quantity * expenses_amount )}</div>
        
        <div>
          <button type="button"
            className={styles.deleteItem}
            onClick={this.props.deleteHandler(index)}
          ><DeleteIcon size="1.25em" /></button>
        </div>
      </div>
    )
  }
}

export default LineItem

LineItem.propTypes = {
  index: PropTypes.number.isRequired,
  name: PropTypes.string,
  description: PropTypes.string,
  quantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  expenses_amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}


