import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { expect } from 'chai'
import {
  Contract,
  ContractFactory,
  ContractReceipt,
  ContractTransaction,
} from 'ethers'
import { ethers } from 'hardhat'

describe('ERC721Bollywood', () => {
  let accounts: SignerWithAddress[]
  let ERC721Bollywood: ContractFactory
  let erc721Bollywood: Contract

  it('deploy', async () => {
    accounts = await ethers.getSigners()
    const [owner, addr1, addr2, addr3, addr4] = accounts
    ERC721Bollywood = await ethers.getContractFactory('ERC721Bollywood')
    erc721Bollywood = await ERC721Bollywood.deploy(
      30,
      'https://localhost:3000/',
    )
    await erc721Bollywood.deployed()
  })

  it('mint', async () => {
    const [owner, addr1, addr2] = accounts
    let tx: ContractTransaction = await erc721Bollywood
      .connect(owner)
      .mint(10, {
        value: '2000000000000000000',
      })
    expect(
      (await erc721Bollywood.balanceOf(owner.address)).toString(),
    ).to.equal('10')
    expect((await erc721Bollywood.baseURI()).toString()).to.equal(
      'https://localhost:3000/',
    )
  })
})
