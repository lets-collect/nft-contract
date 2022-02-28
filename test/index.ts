import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { expect } from 'chai'
import { Contract, ContractFactory, ContractTransaction } from 'ethers'
import { ethers } from 'hardhat'

describe('ERC721LetsCollect', () => {
  let accounts: SignerWithAddress[]
  let ERC721LetsCollect: ContractFactory
  let erc721LetsCollect: Contract

  it('deploy', async () => {
    accounts = await ethers.getSigners()
    const [owner, addr1, addr2, addr3, addr4] = accounts
    ERC721LetsCollect = await ethers.getContractFactory('ERC721LetsCollect')
    erc721LetsCollect = await ERC721LetsCollect.deploy('https://localhost:3000/')
    await erc721LetsCollect.deployed()
  })

  it('mint plantinum', async () => {
    const [owner, addr1, addr2] = accounts
    let tx: ContractTransaction = await erc721LetsCollect
      .connect(owner)
      .mint('Plantinum', {
        value: '3000000000000000000',
      })
    expect(
      (await erc721LetsCollect.balanceOf(owner.address)).toString(),
    ).to.equal('1')
    expect((await erc721LetsCollect.tokenURI(1)).toString()).to.equal(
      'https://localhost:3000/1.json',
    )
    expect(await erc721LetsCollect.tokenType(1)).to.equal('Plantinum')
    expect((await erc721LetsCollect.maxSupply('Plantinum')).toString()).to.equal(
      '1',
    )
  })

  it('mint plantinum exceed', async () => {
    const [owner, addr1, addr2] = accounts
    await erc721LetsCollect.connect(owner).mint('Plantinum', {
      value: '3000000000000000000',
    })
  })

  it('mint gold', async () => {
    const [owner, addr1, addr2] = accounts
    await erc721LetsCollect.connect(owner).mint('Gold', {
      value: '2000000000000000000',
    })
    await erc721LetsCollect.connect(addr1).mint('Gold', {
      value: '2000000000000000000',
    })
    await erc721LetsCollect.connect(addr2).mint('Gold', {
      value: '2000000000000000000',
    })
    expect((await erc721LetsCollect.tokenURI(2)).toString()).to.equal(
      'https://localhost:3000/2.json',
    )
    expect(await erc721LetsCollect.tokenType(2)).to.equal('Gold')
    expect((await erc721LetsCollect.maxSupply('Gold')).toString()).to.equal('5')
    expect((await erc721LetsCollect.currentSupply('Gold')).toString()).to.equal(
      '3',
    )
  })
})
