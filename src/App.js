import React, { Component } from 'react';
import './App.css';
import { Form, Icon, Input, Button, InputNumber, Table, message, Popconfirm, Row, Col, Modal } from 'antd';
import NumericInput from './NumericInput';
import { Collapse } from 'antd';

const { Panel } = Collapse;

const Column = Table.Column;

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      description: "",
      unit: undefined,
      value: null,
      cartList: JSON.parse(localStorage.getItem('makro-cart-items')) || [],
      wihsList: JSON.parse(localStorage.getItem('makro-wish-list')) || [],
      editionMode: false,
      showAddFromWohsiList: false,
    }
    this.onChangeUnit = this.onChangeUnit.bind(this);
    this.onChangeValue = this.onChangeValue.bind(this);
    this.onAddElement = this.onAddElement.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onEditItem = this.onEditItem.bind(this);
    this.onChangeWishDescription = this.onChangeWishDescription.bind(this); 
    this.onAddWishList = this.onAddWishList.bind(this); 
    this.hideModal = this.hideModal.bind(this);
    this.openModal = this.openModal.bind(this);
    this.addElementFromWishList = this.addElementFromWishList.bind(this);
  }

  onEditItem(item) {
    this.setState({
      editionMode: true,
      description: item.description,
      value: item.value,
      unit: item.unit
    })
  }

  openModal(data){
    this.setState({
      showAddFromWohsiList:true,
      wishDescription:data.description,
    })
  }

  onAddElement(fromWishList) {
    message.destroy();
    const newItem = {
      description: fromWishList || this.state.description,
      unit: this.state.unit,
      value: this.state.value
    }
    if (this.state.cartList.some(item => item.description === newItem.description) && !this.state.editionMode) {
      message.error(<React.Fragment>Ya existe el item: <b>{newItem.description}</b>. Editelo o elimine el mismo</React.Fragment>, 2);
      return true;
    }
    let newCart = this.state.cartList.slice();
    if (this.state.editionMode) {
      const idx = newCart.findIndex(item => item.description === newItem.description);
      newCart[idx].value = newItem.value;
      newCart[idx].unit = newItem.unit;
      this.setState({
        editionMode: false,
        cartList: newCart,
        description: "",
        unit: 1,
        value: null
      })
      message.success(<React.Fragment><b>{newItem.description}</b> Editado correctamente. Nuevo Total: <b>$ {newItem.unit * newItem.value}</b> </React.Fragment>, 3);
    } else {
      newCart.push(newItem)
      localStorage.setItem('makro-cart-items', JSON.stringify(newCart));
      this.setState({
        cartList: newCart,
        description: "",
        unit: 1,
        value: null
      })
      message.success(<React.Fragment><b>{newItem.description}</b> cargado correctamente. Total: <b>$ {newItem.unit * newItem.value}</b> </React.Fragment>, 3);
    }
  }

  addElementFromWishList(){
    const itemwish = this.state.wishDescription;
    this.onAddElement(itemwish);
    this.onDeleteWish({description: itemwish})
    this.hideModal();
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
  onChangeDescription(e) {
    this.setState({
      description: e.target.value
    })
  }

  onDelete(data) {
    const newData = this.state.cartList.filter(item => {
      return item.description !== data.description;
    });
    this.setState({
      cartList: newData
    });
    localStorage.setItem('makro-cart-items', JSON.stringify(newData));
    message.success(<React.Fragment>Item: <b>{data.description}</b> eliminado correctamente del carrito.</React.Fragment>, 3);
  }

  onDeleteWish(data) {
    const newData = this.state.wihsList.filter(item => {
      return item.description !== data.description;
    });
    this.setState({
      wihsList: newData
    });
    localStorage.setItem('makro-wish-list', JSON.stringify(newData));
    message.success(<React.Fragment>Item: <b>{data.description}</b> eliminado correctamente de la lista de deseados.</React.Fragment>, 3);

  }
  onChangeWishDescription(e){
    this.setState({
      wishDescription: e.target.value
    })
  }
  onAddWishList(){
    let actualItemes = this.state.wihsList;
    actualItemes.push({description:this.state.wishDescription});
    message.success(<React.Fragment><b>{this.state.wishDescription}</b> añidido correctamente a deseados</React.Fragment>, 3);
    this.setState({
      wihsList: actualItemes,
      wishDescription:undefined
    })
    localStorage.setItem('makro-wish-list', JSON.stringify(actualItemes));
  }

  hideModal(){
    this.setState({
      showAddFromWohsiList: false,
      wishDescription: undefined,
      unit: undefined,
      value: undefined
    })
  }

  render() {
    let mensaje = "Todavia no ha cargado nigun valor";
    if (this.state.cartList.length) {
      const toal = this.state.cartList.map(item => item.unit * item.value).reduce((firstValue, secondValue) => firstValue + secondValue);
      mensaje = "Gasto Total: $" + toal;
    }

    const buttonMsg = this.state.editionMode ? "Guradar" : "Agregar";
    const buttonIcon = this.state.editionMode ? "save" : "shopping-cart";
    const disableButton = !this.state.description || !this.state.unit || !this.state.value
    const disableWishButton = !this.state.wishDescription;
    return (
      <div className="App">
          <Modal
            title={<p>Añadiendo <b>{this.state.wishDescription}</b> al carrito</p>}
            visible={this.state.showAddFromWohsiList}
            onOk={this.addElementFromWishList}
            width={400}
            onCancel={this.hideModal}>
          <Row type="flex" align='middle' justify='center'>
                  <Col sm={12}>
                        <Form.Item>
                          <NumericInput value={this.state.unit}
                            onChange={this.onChangeUnit}
                            style={{width:200}}
                            prefix={<Icon type="number" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            placeholder="Cantidad"
                          />
                        </Form.Item>
                      </Col>
                      <Col sm={12}>
                        <Form.Item>
                          <InputNumber
                            defaultValue={this.state.value}
                            value={this.state.value}
                            style={{width:200}}
                            placeholder="Precio"
                            formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                            onChange={this.onChangeValue}
                          />
                        </Form.Item>
                    </Col>
                </Row>
          </Modal>
        <Collapse>
          <Panel header="Añadir al carrito">
          <Row type="flex" align='middle' justify='center'>
              <Form layout="inline">
                <Col sm={6}>
                  <Form.Item>
                    <Input
                      prefix={<Icon type="barcode" style={{ color: 'rgba(0,0,0,.25)' }} />}
                      placeholder="Ingrese Descripcion"
                      disabled={this.state.editionMode}
                      onChange={this.onChangeDescription}
                      value={this.state.description}
                    />
                  </Form.Item>
                </Col>
                <Col sm={6}>
                  <Form.Item>
                    <NumericInput value={this.state.unit}
                      onChange={this.onChangeUnit}
                      prefix={<Icon type="number" style={{ color: 'rgba(0,0,0,.25)' }} />}
                      placeholder="Cantidad"
                    />
                  </Form.Item>
                </Col>
                <Col sm={6}>
                  <Form.Item>
                    <InputNumber
                      defaultValue={this.state.value}
                      value={this.state.value}
                      placeholder="Precio"
                      style={{width:190}}
                      formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={value => value.replace(/\$\s?|(,*)/g, '')}
                      onChange={this.onChangeValue}
                    />
                  </Form.Item>
                </Col>
                <Col sm={6}>
                  <Form.Item>
                    <Button type="primary" icon={buttonIcon} onClick={this.onAddElement} disabled={disableButton}>
                      {buttonMsg}
                    </Button>
                  </Form.Item>
                </Col>
              </Form>
            </Row>
            <br />
            <b> {mensaje}</b>
            <br />
            <br />
            <Table dataSource={this.state.cartList} pagination={true} size='small' bordered={true} rowKey="description">
              <Column align='center' key='description' title='Descripcion' dataIndex='description' />
              <Column align='center' key='unit' title='Cantidad' dataIndex='unit' />
              <Column align='center' key='value' title='Precio Unitario' dataIndex='value' />
              <Column align='center' key='totalUnit' title='Total Item' render={data => {
                return data.unit * data.value
              }} />
              <Column align='center' key='action' title='Acciones' render={data => {
                return (<React.Fragment>
                  <Icon type="edit" style={{ color: 'blue', marginRight: 30 }} title="Borrar Item" onClick={() => this.onEditItem(data)} />
                  <Popconfirm placement="top" title={"Esta seguro de eliminar: " + data.description + "?"} onConfirm={() => this.onDelete(data)} okText="Yes" cancelText="No">
                    <Icon type="delete" style={{ color: 'red' }} title="Borrar Item" />
                  </Popconfirm>
                </React.Fragment>
                );
              }} />
            </Table>
          </Panel>
          <Panel header="Lista de Compra">
          <Row type="flex" align='middle' justify='center'>
              <Form layout="inline">
                <Col sm={14}>
                  <Form.Item>
                    <Input
                      prefix={<Icon type="barcode" style={{ color: 'rgba(0,0,0,.25)' }} />}
                      placeholder="Ingrese Descripcion"
                      disabled={this.state.editionMode}
                      onChange={this.onChangeWishDescription}
                      value={this.state.wishDescription}
                    />
                  </Form.Item>
                </Col>
                <Col sm={10}>
                  <Form.Item>
                    <Button type="primary" icon={buttonIcon} onClick={this.onAddWishList} disabled={disableWishButton}>
                        Añadir a Lista
                    </Button>
                  </Form.Item>
                </Col>
              </Form>
            </Row>
            <br />
            <br />
            <Table dataSource={this.state.wihsList} pagination={true} size='small' bordered={true} rowKey="description">
              <Column align='center' key='description' title='Descripcion' dataIndex='description' />
              <Column align='center' key='action' title='Acciones' render={data => {
                return (<React.Fragment>
                  <Icon type="shopping-cart" style={{ color: 'green', marginRight: 30 }} title="v" onClick={() => this.openModal(data)}/>
                  <Popconfirm placement="top" title={"Esta seguro de remover: " + data.description + "?"} onConfirm={() => this.onDeleteWish(data)} okText="Yes" cancelText="No">
                    <Icon type="delete" style={{ color: 'red' }} title="Borrar Item" />
                  </Popconfirm>
                </React.Fragment>
                );
              }} />
            </Table>
          </Panel>
        </Collapse>
      </div>
    );
  }
}
export default App;
