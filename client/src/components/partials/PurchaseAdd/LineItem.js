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
      //console.log(mix);
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

    const { index, name, item_desc, qty, price ,total_price} = this.props

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
        <div><input name="item_desc" type="text" value={item_desc} onChange={this.props.changeHandler(index)} /></div>
        <div><input name="qty" type="number" step="1" value={qty} onChange={this.props.changeHandlerPrice(index,price)} onFocus={this.props.focusHandler} ></input></div>
        <div className={styles.currency}><input name="price" type="number" step="0.01" min="0.00" max="9999999.99" value={price} onChange={this.props.changeHandlerPrice(index,qty)} onFocus={this.props.focusHandler} /></div>
        <div className={styles.currency}>{this.props.currencyFormatter( qty * price )}</div>
        
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
  item_desc: PropTypes.string,
  qty: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}


