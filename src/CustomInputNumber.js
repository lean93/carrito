import React, { Component } from 'react';
import { Drawer ,Button, Row, Col, Slider, Icon } from 'antd';


class CustomInputNumber extends Component {

    constructor(props) {
        super(props)
        this.state = {
            value:0,
            cant:1,
            sign:1,
            divisor:1
        }
        this.onAddValue = this.onAddValue.bind(this);
        this.onChangeCant =this.onChangeCant.bind(this);
        this.changeSign = this.changeSign.bind(this);
        this.onChangeDivisor = this.onChangeDivisor.bind(this);
        this.onAddToChart = this.onAddToChart.bind(this);
        this.onClear = this.onClear.bind(this);
    }

    onAddValue(plus){
        const inputAdd = Number.parseFloat((plus  / this.state.divisor).toFixed(2));
        const actual = Number.parseFloat(this.state.value.toFixed(2));
        const toADd = Number.parseFloat((inputAdd * this.state.sign).toFixed(2));
        this.setState({
            value : Number.parseFloat((actual + toADd).toFixed(2))
        })
    }

    changeSign(){
        this.setState({
            sign: this.state.sign * -1
        })
    }

    onChangeCant(value){
        this.setState({
            cant: value
        })
    }

    getNumberType(value){
        return value>0 ? 'primary' : 'danger'
    }

    getDecimalType(value){
        return value===1 ? 'default' : 'primary'
    }

    onChangeDivisor(){
        const actual = this.state.divisor;
        this.setState({
            divisor: actual===1? 100 : 1
        })
    }

    onAddToChart(){
        const result = {
            description: this.props.description,
            value: this.state.value,
            unit: this.state.cant
        }
        console.log(result);
        this.props.onSubmit(result);
        this.onClear();
    }

    onClear(){
        this.setState({
            value:0,
            cant:1,
            sign:1,
            divisor:1
        })
    }

    render() {
        const buttonType = this.getNumberType(this.state.sign);
        const decimalType = this.getDecimalType(this.state.divisor);
        const fixedValue = this.state.divisor ===1? 0 :2
        const result = Number.parseFloat((this.state.value * this.state.cant).toFixed(2));
        const iconSign = this.state.sign <0 ? "caret-down": "caret-up"
        const iconSignButton = this.state.sign <0 ? "danger": "primary"

        return (<Drawer
                    title={<p style={{fontSize:20}}>Añadiendo a carrito: <b>{this.props.description}</b></p>}
                    placement='bottom'
                    height="600"
                    closable={false}
                    onClose={this.props.onClose}
                    visible={this.props.visible}>

                    <Row type="flex" align='middle' justify='center' gutter={24} style={{marginBottom:20}}>
                        <p style={{fontSize:30, color:"#1B56AB"}}>
                            <b style={{fontSize:50}}>$ {this.state.value}</b> 
                            (x{this.state.cant}) = ${result}
                        </p>
                    </Row>

                    <Row type="flex" align='middle' justify='center' gutter={24} style={{marginBottom:20}}>
                        <Col sm={6}>
                        <Button style={{ width: 60 }} onClick={()=>this.onAddValue(1)} type={buttonType} size='large'>
                            <b>{(1/this.state.divisor).toFixed(fixedValue)}</b>
                        </Button>
                        </Col>
                        <Col sm={6}>
                        <Button style={{ width: 60 }} onClick={()=>this.onAddValue(2)} type={buttonType} size='large'>
                            <b>{(2/this.state.divisor).toFixed(fixedValue)}</b>
                        </Button>
                        </Col>
                        <Col sm={6}>
                        <Button style={{ width: 60 }} onClick={()=>this.onAddValue(5)} type={buttonType} size='large'>
                            <b>{(5/this.state.divisor).toFixed(fixedValue)}</b>
                        </Button>
                        </Col>
                        <Col sm={6}>
                        <Button style={{ width: 60 }} onClick={()=>this.onAddValue(10)} type={buttonType} size='large'>
                            <b>{(10/this.state.divisor).toFixed(fixedValue)}</b>
                        </Button>
                        </Col>
                    </Row>

                    <Row type="flex" align='middle' justify='center' gutter={24} style={{marginBottom:60}}>
                        <Col sm={6}>
                        <Button style={{ width: 60 }} onClick={()=>this.onAddValue(20)} type={buttonType} size='large'>
                            <b>{(20/this.state.divisor).toFixed(fixedValue)}</b>
                        </Button>
                        </Col>
                        <Col sm={6}>
                        <Button style={{ width: 60 }} onClick={()=>this.onAddValue(50)} type={buttonType} size='large'>
                            <b>{(50/this.state.divisor).toFixed(fixedValue)}</b>
                        </Button>
                        </Col>
                        <Col sm={6}>
                        <Button style={{ width: 60 }} onClick={()=>this.onAddValue(100)} type={buttonType} size='large'>
                            <b>{(100/this.state.divisor).toFixed(fixedValue)}</b>
                        </Button>
                        </Col>
                        <Col sm={6}>
                        <Button style={{ width: 60 }} onClick={()=>this.onAddValue(500)} type={buttonType} size='large'>
                            <b>{(500/this.state.divisor).toFixed(fixedValue)}</b>
                        </Button>
                        </Col>
                    </Row>
                    <Row type="flex" align='middle' justify='center' gutter={24} style={{marginBottom:20}}>
                        <Col sm={8}>
                        <Button style={{ width: 100,  }} type={iconSignButton} onClick={this.changeSign} size='large'>
                            <Icon type={iconSign} style={{margin:0}}/> <Icon type="dollar" style={{margin:0}} />
                        </Button>
                        </Col>
                        <Col sm={8}>
                        <Button style={{ width: 100 }} onClick={this.onChangeDivisor} type={decimalType} size='large'>
                            <b>.00</b>
                        </Button>
                        </Col>
                        <Col sm={8}>
                        <Button style={{ width: 100 }} onClick={this.onClear} size='large' icon='reload' type='dashed'>
                            Limpiar
                        </Button>
                        </Col>
                    </Row>

                    <Row gutter={24} style={{marginBottom:20}}>
                        <Col sm={24}>
                            <Slider min={1} max={30} value={this.state.cant} onChange={this.onChangeCant}/>
                        </Col>
                    </Row>

                    <Row type="flex" align='middle' justify='center' gutter={24}>
                        <Col sm={24}>
                        <Button style={{ width: '100dv' }} icon='shopping-cart' type='primary' onClick={this.onAddToChart}>
                            Agregar Al carrito
                        </Button>
                        </Col>
                    </Row>
        </Drawer>);
    }
}

export default CustomInputNumber;