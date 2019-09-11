import React, { Component } from 'react';
import { Drawer ,Button, Row, Col, Slider, Icon, Checkbox, Badge } from 'antd';

class CustomInputNumber extends Component {

    constructor(props) {
        super(props)
        this.state = {
            value:0,
            cant:1,
            sign:1,
            divisor:1,
            iva:true,
            lastValueAdded:0
        }
        this.onAddValue = this.onAddValue.bind(this);
        this.onChangeCant =this.onChangeCant.bind(this);
        this.changeSign = this.changeSign.bind(this);
        this.onChangeDivisor = this.onChangeDivisor.bind(this);
        this.onAddToChart = this.onAddToChart.bind(this);
        this.onClear = this.onClear.bind(this);
        this.onChangeIVA = this.onChangeIVA.bind(this);
        this.onResetCount = this.onResetCount.bind(this);
    }

    onResetCount(){
        this.setState({
            lastValueAdded:0
        })
    }

    onAddValue(plus){
        const inputAdd = Number.parseFloat((plus  / this.state.divisor).toFixed(2));
        const actual = Number.parseFloat(this.state.value.toFixed(2));
        const toADd = Number.parseFloat((inputAdd * this.state.sign).toFixed(2));
        this.setState({
            value : Number.parseFloat((actual + toADd).toFixed(2)),
            lastValueAdded: plus
        })
        const rest = this.onResetCount;
        setTimeout(
            function() {
                rest();
        }, 500);
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
        const fullValue = this.state.iva? this.state.value : Number.parseFloat((this.state.value*1.21).toFixed(2)); 
        const result = {
            description: this.props.description,
            value: fullValue,
            unit: this.state.cant
        }
        this.props.onSubmit(result);
        this.onClear();
    }

    onClear(){
        this.setState({
            value:0,
            cant:1,
            sign:1,
            divisor:1,
            iva:true
        })
    }

    onChangeIVA(e){
        this.setState({
            iva: e.target.checked
        });
    }
    render() {
        const buttonType = this.getNumberType(this.state.sign);
        const decimalType = this.getDecimalType(this.state.divisor);
        const fixedValue = this.state.divisor ===1? 0 :2
        let result = Number.parseFloat((this.state.value * this.state.cant).toFixed(2));
        const iconSign = this.state.sign <0 ? "caret-down": "caret-up";
        const badgetColor = this.state.sign <0 ? "#E57060": "#6DC168";
        const iconSignButton = this.state.sign <0 ? "danger": "primary";
        const numericButtons = [1,2,5,10,20,50,100,500];
        let extraData = ""
        if(!this.state.iva){
            extraData = "(+$" + (result*0.21).toFixed(2)+")";
            result = Number.parseFloat((result*1.21).toFixed(2));   
        }

        return (<Drawer
                    title={<p style={{fontSize:20}}>Añadiendo a carrito: <b>{this.props.description}</b></p>}
                    placement='bottom'
                    height="600"
                    closable={false}
                    onClose={this.props.onClose}
                    visible={this.props.visible}>

                    <Row type="flex" align='middle' justify='center' gutter={24} style={{padding:0}}>
                        <Col>
                            <div style={{fontSize:30, color:"#1B56AB", marginBottom:0}}>
                                <p style={{marginBottom:0, textAlign:'centers'}}>
                                <Badge count={this.state.lastValueAdded} style={{backgroundColor:badgetColor}}>
                                    <b style={{fontSize:50}}>$ {this.state.value}</b> 
                                </Badge>
                                (x{this.state.cant}) =</p> 
                                <p style={{marginBottom:0, textAlign:'center'}}>${result} <i style={{fontSize:20, color:'#B65F5F'}}>{extraData}</i></p>
                            </div>
                        </Col>
                    </Row>

                    <Row type="flex" align='middle' justify='center' gutter={24} style={{marginBottom:40}}>
                        <Col>
                            <Checkbox checked={this.state.iva} onChange={this.onChangeIVA}><b> Incluye IVA</b></Checkbox>
                        </Col>
                    </Row>
                    <Row type="flex" align='middle' justify='center' gutter={24} style={{marginBottom:20}}>
                        {numericButtons.map(value=>
                            <Col  span={6}key={value}>
                                <Button style={{ width: 65, marginBottom:20 }} onClick={()=>this.onAddValue(value)} type={buttonType} size='large'>
                                    <b>{(value/this.state.divisor).toFixed(fixedValue)}</b>
                                </Button>
                            </Col>
                        )}
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

                    <Row style={{marginBottom:20}} type="flex" align='middle' justify='center'>
                        <Col span={1}>
                            <b>1</b>
                        </Col>
                        <Col span={21}>
                        <Slider min={1} max={20} value={this.state.cant} onChange={this.onChangeCant}/>
                        </Col>
                        <Col span={2}>
                            <b>20</b>
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