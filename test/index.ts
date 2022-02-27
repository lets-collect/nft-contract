import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { expect } from 'chai'
import { Contract, ContractFactory, ContractTransaction } from 'ethers'
import { ethers } from 'hardhat'

describe('ERC721BollyCoin', () => {
  let accounts: SignerWithAddress[]
  let ERC721BollyCoin: ContractFactory
  let erc721BollyCoin: Contract

  it('deploy', async () => {
    accounts = await ethers.getSigners()
    const [owner, addr1, addr2, addr3, addr4] = accounts
    ERC721BollyCoin = await ethers.getContractFactory('ERC721BollyCoin')
    erc721BollyCoin = await ERC721BollyCoin.deploy('https://localhost:3000/')
    await erc721BollyCoin.deployed()
  })

  it('mint plantinum', async () => {
    const [owner, addr1, addr2] = accounts
    let tx: ContractTransaction = await erc721BollyCoin
      .connect(owner)
      .mint('Plantinum', {
        value: '3000000000000000000',
      })
    expect(
      (await erc721BollyCoin.balanceOf(owner.address)).toString(),
    ).to.equal('1')
    expect((await erc721BollyCoin.tokenURI(1)).toString()).to.equal(
      'https://localhost:3000/1.json',
    )
    expect(await erc721BollyCoin.tokenType(1)).to.equal('Plantinum')
    expect((await erc721BollyCoin.maxSupply('Plantinum')).toString()).to.equal(
      '1',
    )
  })

  it('mint plantinum exceed', async () => {
    const [owner, addr1, addr2] = accounts
    await erc721BollyCoin.connect(owner).mint('Plantinum', {
      value: '3000000000000000000',
    })
  })

  it('mint gold', async () => {
    const [owner, addr1, addr2] = accounts
    await erc721BollyCoin.connect(owner).mint('Gold', {
      value: '2000000000000000000',
    })
    await erc721BollyCoin.connect(addr1).mint('Gold', {
      value: '2000000000000000000',
    })
    await erc721BollyCoin.connect(addr2).mint('Gold', {
      value: '2000000000000000000',
    })
    expect((await erc721BollyCoin.tokenURI(2)).toString()).to.equal(
      'https://localhost:3000/2.json',
    )
    expect(await erc721BollyCoin.tokenType(2)).to.equal('Gold')
    expect((await erc721BollyCoin.maxSupply('Gold')).toString()).to.equal('5')
    expect((await erc721BollyCoin.currentSupply('Gold')).toString()).to.equal(
      '3',
    )
  })
})
