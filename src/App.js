import React, { Component } from 'react';
import './App.css';
import { Form, Icon, Input, Button, Table, message, Popconfirm, Row, Col, Layout } from 'antd';
import { Collapse } from 'antd';
import CustomInputNumber from './CustomInputNumber';

const { Footer, Content } = Layout;
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
      showAddFromChart:false,
      item:{}
    }
    this.onAddElement = this.onAddElement.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onEditItem = this.onEditItem.bind(this);
    this.onChangeWishDescription = this.onChangeWishDescription.bind(this);
    this.onAddWishList = this.onAddWishList.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.openModal = this.openModal.bind(this);
    this.addElementFromWishList = this.addElementFromWishList.bind(this);
    this.onSubmitWishList = this.onSubmitWishList.bind(this);
    this.openModalChart = this.openModalChart.bind(this);
  }

  onEditItem(item) {
    this.setState({
      editionMode: true,
      description: item.description,
      showAddFromChart:true,
      item: item
    })
  }

  openModal(data) {
    this.setState({
      showAddFromWohsiList: true,
      wishDescription: data.description,
    })
  }

  openModalChart() {
    this.setState({
      showAddFromChart: true,
    })
  }

  onAddElement(data) {
    message.destroy();
    const newItem = data;
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
        unit: undefined,
        value: null
      })
      message.success(<React.Fragment><b>{newItem.description}</b> Editado correctamente. Nuevo Total: <b>$ {newItem.unit * newItem.value}</b> </React.Fragment>, 3);
    } else {
      newCart.push(newItem)
      localStorage.setItem('makro-cart-items', JSON.stringify(newCart));
      this.setState({
        cartList: newCart,
        description: "",
        unit: undefined,
        value: null
      })
      message.success(<React.Fragment><b>{newItem.description}</b> cargado correctamente. Total: <b>$ {newItem.unit * newItem.value}</b> </React.Fragment>, 3);
    }
  }

  addElementFromWishList() {
    const itemwish = this.state.wishDescription;
    this.onAddElement(itemwish);
    this.onDeleteWish({ description: itemwish })
    this.hideModal();
  }

  onSubmitWishList(data){
    this.onAddElement(data);
    this.onDeleteWish({ description: data.description })
    this.hideModal();
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

  onChangeWishDescription(e) {
    this.setState({
      wishDescription: e.target.value
    })
  }
  onAddWishList() {
    const newWishItems = this.state.wishDescription;
    if (this.state.cartList.some(item => item.description === newWishItems)) {
      message.error(<React.Fragment>Ya existe: <b>{newWishItems}</b> en el carrito</React.Fragment>, 3);
    } else {
      let actualItemes = this.state.wihsList;
      actualItemes.push({ description: newWishItems });
      message.success(<React.Fragment><b>{newWishItems}</b> añidido correctamente a deseados</React.Fragment>, 3);
      this.setState({
        wihsList: actualItemes,
        wishDescription: undefined
      })
      localStorage.setItem('makro-wish-list', JSON.stringify(actualItemes));
    }
  }

  hideModal() {
    this.setState({
      showAddFromWohsiList: false,
      showAddFromChart:false,
      wishDescription: undefined,
      unit: undefined,
      value: undefined,
      description:undefined,
      editionMode:false
    })
  }

  render() {
    message.config({top: 600})
    let mensaje = "Todavia no ha cargado nigun valor";
    if (this.state.cartList.length) {
      const toal = this.state.cartList.map(item => item.unit * item.value).reduce((firstValue, secondValue) => firstValue + secondValue);
        mensaje = "Gasto Total: $" + toal.toFixed(2);      
      ;
    }

    const buttonMsg = this.state.editionMode ? "Guardar Cambios" : "Agregar";
    const buttonIcon = this.state.editionMode ? "save" : "shopping-cart";
    const disableButton = !this.state.description;
    const disableWishButton = !this.state.wishDescription;
    return (
      <div className="App" style={{ backgroundColor: '#393939' }}>
        <CustomInputNumber visible={this.state.showAddFromWohsiList} onClose={this.hideModal} description={this.state.wishDescription} 
                        onSubmit={this.onSubmitWishList} />

         <CustomInputNumber visible={this.state.showAddFromChart} onClose={this.hideModal} description={this.state.description} 
                        onSubmit={this.onSubmitWishList} data={this.state.item} edit={this.state.editionMode}/>

        <Layout style={{ backgroundColor: '#393939', display:'flex', flexDirection:'column', width:'100%'}}>
          <Content style={{ backgroundColor: '#393939', flex:'1 0 auto'}}>
            <Collapse accordion>
              <Panel header={<React.Fragment><Icon type="shopping-cart" /> <b>Carrito</b></React.Fragment>}>
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
                        <Button type="primary" icon={buttonIcon} onClick={this.openModalChart} disabled={disableButton}>
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
                    return   Number.parseFloat((data.unit * data.value).toFixed(2));      
                  }} />
                  <Column align='center' key='action' title='Acciones' render={data => {
                    return (<React.Fragment>
                      <Icon type="edit" style={{ color: 'blue', marginRight: 15 }} title="Borrar Item" onClick={() => this.onEditItem(data)} />
                      <Popconfirm placement="top" title={"Esta seguro de eliminar: " + data.description + "?"} onConfirm={() => this.onDelete(data)} okText="Yes" cancelText="No">
                        <Icon type="delete" style={{ color: 'red' }} title="Borrar Item" />
                      </Popconfirm>
                    </React.Fragment>
                    );
                  }} />
                </Table>
              </Panel>
              
              <Panel header={<React.Fragment><Icon type="ordered-list" />   Lista de Compra</React.Fragment>}>
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
                      <Icon type="shopping-cart" style={{ color: 'green', marginRight: 30 }} title="v" onClick={() => this.openModal(data)} />
                      <Popconfirm placement="top" title={"Esta seguro de remover: " + data.description + "?"} onConfirm={() => this.onDeleteWish(data)} okText="Yes" cancelText="No">
                        <Icon type="delete" style={{ color: 'red' }} title="Borrar Item" />
                      </Popconfirm>
                    </React.Fragment>
                    );
                  }} />
                </Table>
              </Panel>
            </Collapse>
          </Content>
          <Footer style={{ backgroundColor: '#393939', flexShrink:0 }}>
            <p style={{ color: 'white' }}>Carrito developed by <b> <a href="https://github.com/lean93">@Lean93</a></b></p>
          </Footer>
        </Layout>
      </div>
    );
  }
}
export default App;
