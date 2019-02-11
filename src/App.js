import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import lottery from './lottery';

class App extends Component {
state = {
  manager:'',
  players:[],
  balance:'',
  value: '',
  message:'',
  winner:'hide'
};
  async componentDidMount()
  {
    const manager = await lottery.methods.manager().call();// no need to send property while usong metamask as it sends ten default address
    const players = await lottery.methods.getPlayers().call();
    const account =  await web3.eth.getAccounts();
    if(account[0] == manager)
    {
      this.setState({winner:'show'});
    }
    const balance = await web3.eth.getBalance(lottery.options.address);
    this.setState({manager,players,balance});
  }
  async componentDidUpdate()
  {
    const manager = await lottery.methods.manager().call();// no need to send property while usong metamask as it sends ten default address
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    this.setState({manager,players,balance});
  }

async submit(e)
{
  e.preventDefault();
  const accounts = await web3.eth.getAccounts();

  this.setState({message:"your transaction is under process"});
  await lottery.methods.enter().send({from:accounts[0],value:web3.utils.toWei(this.state.value,'ether')});
  this.setState({message:"You are now the part of lottery"});
}
async click(e)
{
  e.preventDefault();
  const accounts = await web3.eth.getAccounts();

  this.setState({message:"your transaction is under process"});
  await lottery.methods.getWinner().send({from:accounts[0]});

  this.setState({message:"Winner is selected"});
}
  render() {

    return (
      <div>
        <h2>Lottery Contract</h2>
        <p>The contract is managed by {this.state.manager} </p>
        <p>There are currently {this.state.players.length} players competing for {web3.utils.fromWei(this.state.balance,'ether')} ethers</p>
        <form onSubmit = {this.submit.bind(this)}>
              <h4>Wanna try your luck?</h4>
              <p>Add some Ether</p>
              <input
              value = {this.state.value}
              onChange = {e => this.setState({value:e.target.value})}
               />
               <button>Enter</button>

        </form>
        <hr />
        <h2>{this.state.message}</h2>
        <hr />
        <div className="winner"  style= {this.state.winner =='show'?{}:{display:'none'}}>
          <h2>Time to select winner!</h2>
          <button onClick={this.click.bind(this)} >Find Winner</button>
        </div>
      </div>
    );
  }
}

export default App;
