import React, { Component } from 'react';
import './App.css';
import { Form, Icon, Input, Button, InputNumber, Table, message, Popconfirm } from 'antd';
import NumericInput from './NumericInput';

const Column = Table.Column;

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      description: "",
      unit: 1,
      value: null,
      cartList: JSON.parse(localStorage.getItem('makro-cart-items')) || []
    }
    this.onChangeUnit = this.onChangeUnit.bind(this);
    this.onChangeValue = this.onChangeValue.bind(this);
    this.onAddElement = this.onAddElement.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onDelete = this.onDelete.bind(this);
  }

  onAddElement(){
    const newItem={
      description:this.state.description,
      unit: this.state.unit,
      value: this.state.value
    }
    let newCart = this.state.cartList.slice();
    newCart.push(newItem)
    localStorage.setItem('makro-cart-items', JSON.stringify(newCart));
    this.setState({
      cartList:newCart,
      description: "",
      unit: 1,
      value: null
    })
    message.success(<React.Fragment><b>{newItem.description }</b> cargado correctamente. Total: <b>$ {newItem.unit * newItem.value}</b> </React.Fragment>, 3);
  }

  onChangeUnit(e) {
    this.setState({
      unit: e
    })
  }
  onChangeValue(e) {
    this.setState({
      value: e
    })
  }
  onChangeDescription(e){
    this.setState({
      description: e.target.value
    })
  }

  onDelete(data){
    const newData = this.state.cartList.filter(item =>{
      return item.description !== data.description;
    });
    this.setState({
      cartList: newData
    });
    localStorage.setItem('makro-cart-items', JSON.stringify(newData));
  }
  render() {
    let mensaje = "Todavia no ha cargado nigun valor";
    if(this.state.cartList.length){
      const toal = this.state.cartList.map(item=> item.unit * item.value).reduce((firstValue ,secondValue)=> firstValue + secondValue);
      mensaje = "Gasto Total: $" + toal;
    }
    return (
      <div className="App">
      <React.Fragment>
        <Form layout="inline">
          <Form.Item>
            <Input
              prefix={<Icon type="barcode" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Ingrese Descripcion"
              onChange={this.onChangeDescription}
              value={this.state.description}
            />
          </Form.Item>

          <Form.Item>
            <NumericInput value={this.state.unit}
              onChange={this.onChangeUnit}
              prefix={<Icon type="number" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Cantidad"
            />
          </Form.Item>

          <Form.Item>
            <InputNumber
              defaultValue={this.state.value}
              value={this.state.value}
              placeholder="Precio"
              formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
              onChange={this.onChangeValue}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" icon="shopping-cart" onClick={this.onAddElement} disabled={!this.state.description}>
              Agregar
          </Button>
          </Form.Item>
        </Form>
        <br/>
        <b> {mensaje}</b>
        <br/>
        <br/>
        <Table dataSource={this.state.cartList} pagination={true} size='small' bordered={true} rowKey="description">
            <Column align='center' key='description' title='Descripcion' dataIndex='description' />
            <Column align='center' key='unit' title='Cantidad' dataIndex='unit' />
            <Column align='center' key='value' title='Precio Unitario' dataIndex='value' />
            <Column align='center' key='totalUnit' title='Total Item' render={data=>{
              return data.unit * data.value
            }}/>
            <Column align='center' key='action' title='Acciones' render={data=>{
               return (<Popconfirm placement="top" title={"Esta seguro de eliminar: " + data.description +"?"} onConfirm={()=>this.onDelete(data)} okText="Yes" cancelText="No">
                  <Icon type="delete" style={{color: 'red'}} title="Borrar Item"/>              
                </Popconfirm>)
               
            }}/>
        </Table>

        </React.Fragment>
      </div>
    );
  }
}
export default App;
