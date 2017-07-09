import React from 'react';
import ReactDOM from 'react-dom'
import './App.css';

var res = localStorage.getItem("adverts");
var adverts = JSON.parse(res);
var allAdverts = adverts || [{
  title: "Продам почку",
  description: "$$$",
  phone: "+79349583495"
}];


class AdvertList extends React.Component {
  constructor(props){
    super(props);
    this.addAdvert = this.addAdvert.bind(this);
    this.removeAdvert = this.removeAdvert.bind(this);
  }
  render() {
    var items = this.props.items.map((item, index) => { return (
        <li key={index} >
          <div className="advert">
            <Advert item={item} /> 
            <RemoveAdvertItem addEvent={this.removeAdvert} id={index} />
          </div>  
        </li>);
    });
    return(
      <div>
        <p><AddAdvertItem addEvent={this.addAdvert} /></p>
        <ul>{items}</ul>
      </div>
    );
  }
  removeAdvert(index) {
    allAdverts.splice(index, 1);
    this.setState({ allAdverts });    
  }
  addAdvert(Advert){
    allAdverts.push(Advert.newItem);
    this.setState({ allAdverts });
  }
}

class Advert extends React.Component {
  render(){
    return <div>
      <h4 className="advertTitle">{this.props.item.title}</h4>
      <p className="advertDescr">{this.props.item.description}</p>
      <h4 className="advertPhone">{this.props.item.phone}</h4>
    </div>;
  }
}

class RemoveAdvertItem extends React.Component {
  constructor(props){
    super(props);
    this.onClick = this.onClick.bind(this);
  }
  render(){
    return (
        <button className="deleteButton" id={this.props.id} onClick={this.onClick}>x</button>);
  }
  onClick(event){
    event.preventDefault();
    var index = event.target.id;
    this.props.addEvent(index);

    localStorage.setItem("adverts", JSON.stringify(allAdverts));
  }
}

class AddAdvertItem extends React.Component {
  constructor(props){
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.onTitleChange = this.onTitleChange.bind(this);
    this.onDescrChange = this.onDescrChange.bind(this);
    this.onPhoneChange = this.onPhoneChange.bind(this);
    this.state = { disabledInputButton : true }
    this.newAdvert = this.getInitialAdvert();
    this.inputTouched = {
      title : false,
      description: false,
      phone: false
    }
    this.inputErrorMessage = "";
  }
  getInitialAdvert() {
    return {
      title : "",
      description : "",
      phone : ""
    };
  }
  onTitleChange(event){
    this.inputTouched.title = true;
    this.newAdvert.title = event.target.value;
    this.setState({disabledInputButton : this.isInputInvalid()})
  }
  onDescrChange(event) {
    this.newAdvert.description = event.target.value;
  }
  onPhoneChange(event){
    this.inputTouched.phone = true;
    this.newAdvert.phone = event.target.value;
    this.setState({disabledInputButton : this.isInputInvalid()})
  }
  isInputInvalid(){
    var inputErrorMessage = this.newAdvert.title === "" ? "Название обязательно" : 
      this.newAdvert.phone === "" ? "Телефон обязателен" : 
      this.newAdvert.title.length > 100 ? "Название не более 100 символов" :
      this.newAdvert.description.length > 300 ? "Описание не более 300 символов" : 
      this.newAdvert.phone.length > 12 ? "Введите корректный телефон" :
      !(this.newAdvert.phone.length === 11 && this.newAdvert.phone.slice(0,2) === "89") && 
      !(this.newAdvert.phone.length === 12 && this.newAdvert.phone.slice(0,3) === "+79") ? "Формат ввода 89... или +79..." : 
      (this.newAdvert.phone.split("").some((item, index) => (item < "0" || item > "9") && index > 1)) ? "Введите корректный телефон" : 
      ""; 

    if (this.inputTouched.title && this.inputTouched.phone)
       this.inputErrorMessage = inputErrorMessage;

    return inputErrorMessage !== "";
  }  
  render(){
    return (
      <div className="inputPannel">
        <form >
          <input className="inputTitle" placeholder="Название" ref="itemTitle" type="text" onChange={this.onTitleChange}/>
          <input className="inputDescr" placeholder="Описание" ref="itemDescr" type="text" onChange={this.onDescrChange}/>
          <input className="inputPhone" placeholder="Телефон" ref="itemPhone" type="text" onChange={this.onPhoneChange}/>
          <button className="submitButton" onClick={this.onSubmit} disabled={this.state.disabledInputButton}>
          Добавить объявление</button>
        </form>
        <div className={"inputError " + (this.state.disabledInputButton ? "" : "hidden")}>
          {this.inputErrorMessage}
        </div>
      </div>);
  }
  onSubmit(event){
    event.preventDefault();
    var inputTitle = ReactDOM.findDOMNode(this.refs.itemTitle)
    var inputDescr = ReactDOM.findDOMNode(this.refs.itemDescr)
    var inputPhone = ReactDOM.findDOMNode(this.refs.itemPhone)
    var newItem = {
      title : inputTitle.value,
      description : inputDescr.value,
      phone : inputPhone.value
    }  
    this.props.addEvent({ newItem });

    // set all as default 
    inputTitle.value = '';
    inputDescr.value = '';
    inputPhone.value = '';
 
    this.setState({disabledInputButton : true});
    this.newAdvert = this.getInitialAdvert()
    this.inputTouched.title = false;
    this.inputTouched.phone = false;

    localStorage.setItem("adverts", JSON.stringify(allAdverts));
  }
}
class App extends React.Component {
  render(){
    return (
      <div className="App">
        <AdvertList items={allAdverts} />
      </div>
      );  
  }
}

export default App;
