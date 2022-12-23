import React, { Component } from 'react';
import { Button, Input, Table } from 'semantic-ui-react'

export class Campaign extends Component {

  ONGOING_STATE = '0'
  FAILED_STATE = '1'
  SUCCEEDED_STATE = '2'
  PAID_OUT_STATE = '3'

  state = {
    campaign: {
      name: 'N/A',
      targetAmount: 0,
      totalCollected: 0,
      campaignFinished: false,
      deadline: new Date(0),
      isBeneficiary: false,
      state: ''
    },
    contributionAmount: '0'
  }

 async componentDidMount() {

    const  {drizzle}  = await this.props;
    const contract =  drizzle.contracts.CrowdFundingWithDeadline;

    const name = await contract.methods.name().call()
    const targetAmount = await contract.methods.targetAmount().call()
    const totalCollected = await contract.methods.totalCollected().call()
    const beforeDeadline = await contract.methods.beforeDeadline().call()
    const beneficiary = await contract.methods.beneficiary().call()
    const deadlineSeconds = await contract.methods.fundingDeadline().call()
    const state = await contract.methods.state().call()

    console.log("campaign state", name, targetAmount, totalCollected, beforeDeadline, beneficiary, deadlineSeconds, state)

    var deadlineDate = new Date(0);
    deadlineDate.setUTCSeconds(deadlineSeconds)
    var deadline = !beforeDeadline;

    const accounts = await drizzle.web3.eth.getAccounts()
    var isBeneficiary = beneficiary.toLowerCase() === accounts[0].toLowerCase()

    this.setState({
      campaign: {
          name: name,
          targetAmount: targetAmount,
          totalCollected: totalCollected,
          campaignFinished: deadline,
          deadline: deadlineDate,
          isBeneficiary: isBeneficiary,
          state: state
             }
    })
  }

  render() {
  if (this.state.loading) return "Loading Drizzle...";
  const state = this.state

  var status = '' 
      if (this.state.campaign.state === '0') {
        status = "Ongoing" 
      } else if (state.campaign.state === '1') {
        status = "Failed" 
      } else if (state.campaign.state === '2') {
        status = "Succeeded" 
      } else if (state.campaign.state === '3') {
        status = "Paid Out" 
      }

    return (
      <div>
        <Table celled padded color="teal" striped colSpan="3">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Value</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>

            <Table.Row>
              <Table.Cell singleLine>
                Name
              </Table.Cell>
              <Table.Cell singleLine>
                {state.campaign.name.toString()}
              </Table.Cell>
            </Table.Row>

            <Table.Row>
              <Table.Cell singleLine>
                Target amount
              </Table.Cell>
              <Table.Cell singleLine>
                {state.campaign.targetAmount}
              </Table.Cell>
            </Table.Row>

            <Table.Row>
              <Table.Cell singleLine>
                Total collected
              </Table.Cell>
              <Table.Cell singleLine>
                {state.campaign.totalCollected}
              </Table.Cell>
            </Table.Row>

            <Table.Row>
              <Table.Cell singleLine>
                Has finished
              </Table.Cell>
              <Table.Cell singleLine>
                {state.campaign.campaignFinished.toString()}
              </Table.Cell>
            </Table.Row>


            <Table.Row>
              <Table.Cell singleLine>
                Deadline
              </Table.Cell>
              <Table.Cell singleLine>
                {state.campaign.deadline.toString()}
              </Table.Cell>
            </Table.Row>

            <Table.Row>
              <Table.Cell singleLine>
                I am beneficiary
              </Table.Cell>
              <Table.Cell singleLine>
                {state.campaign.isBeneficiary.toString()}
              </Table.Cell>
            </Table.Row>

            <Table.Row>
              <Table.Cell singleLine>
                Contract state
              </Table.Cell>
              <Table.Cell singleLine>
                { status }
              </Table.Cell>
            </Table.Row>

          </Table.Body>

          <Table.Footer fullWidth>
            <Table.Row>
              <Table.HeaderCell colSpan="2">
                {this.campaignInteractionSection()}
              </Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        </Table>

      </div>
    );
  }

  campaignInteractionSection() {
    if (this.state.campaign.campaignFinished) {
      return this.postCampaignInterface()
    } else {
      return this.contributeInterface()
    }
  }

  postCampaignInterface() {
    if (this.state.campaign.state === this.ONGOING_STATE) {
      return <div>
        <Button type='submit' 
                positive 
                onClick = {this.onFinish}>
                Finish campaign
        </Button>
      </div>
    }

    if (this.state.campaign.state === this.SUCCEEDED_STATE
      && this.state.campaign.isBeneficiary === true) {

      return <div>
        <Button type='submit' 
                positive 
                onClick = {this.onCollect}>
                Collect funds
        </Button>
      </div>
    }

    if (this.state.campaign.state === this.FAILED_STATE) {
      return <div>
        <Button type='submit' 
                negative
                onClick = {this.onRefund}>
                Refund
        </Button>
      </div>
    }
  }

  contributeInterface() {
    return <div>
      <Input
        action={{
          color: 'teal',
          content: 'Contribute',
          onClick: this.onContribute
        }}
        actionPosition='left'
        label='ETH'
        labelPosition='right'
        placeholder='1'
        onChange={(e) => this.setState({contributionAmount: e.target.value})}
      />
    </div>
  }

  onContribute = () => {
    const  { drizzle } = this.props;

    const accounts =  drizzle.web3.eth.getAccounts()
    const amount = drizzle.web3.utils.toWei(
      this.state.contributionAmount,
      'ether'
    )

    const contract = drizzle.contracts.CrowdFundingWithDeadline;
     contract.methods.contribute().send({
      from: accounts[0],
      value: amount
    })

    const campaign = this.state.campaign
    campaign.totalCollected = Number.parseInt(campaign.totalCollected) +  Number.parseInt(amount)

    this.setState({ campaign: campaign })
  }

  onFinish = () => {

    const  { drizzle } = this.props;
    const accounts =  drizzle.web3.eth.getAccounts()

    const contract = drizzle.contracts.CrowdFundingWithDeadline;
     contract.methods.finishCrowdFunding().send({
      from: accounts[0],
      value: 0
    })

    const campaign = this.state.campaign
    this.setState({ campaign: campaign })
  }

  onRefund = () => {

    const  { drizzle } = this.props;
    const accounts =  drizzle.web3.eth.getAccounts()

    const contract = drizzle.contracts.CrowdFundingWithDeadline;
     contract.methods.withdraw().send({
      from: accounts[0],
      value: 0
    })

    const campaign = this.state.campaign
    this.setState({ campaign: campaign })
  }

  onCollect = () => {

    const  { drizzle } = this.props;
    const accounts =  drizzle.web3.eth.getAccounts()

    const contract = drizzle.contracts.CrowdFundingWithDeadline;
     contract.methods.collect().send({
      from: accounts[0],
      value: 0
    })

    const campaign = this.state.campaign
    this.setState({ campaign: campaign })
  }

}

export default Campaign;



