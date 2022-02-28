// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import * as dotenv from 'dotenv'
import fs from 'fs'
import hardhat, { ethers } from 'hardhat'
dotenv.config()

async function main() {
  // Network
  const networkName = hardhat.network.name as 'rinkeby' | 'bscTestnet' | 'bsc'

  const ERC721LetsCollect = await ethers.getContractFactory('ERC721LetsCollect')
  const erc721LetsCollectArgs = ['https://localhost:3000/']
  const erc721LetsCollect = await ERC721LetsCollect.deploy(...erc721LetsCollectArgs)
  await erc721LetsCollect.deployed()

  const scanURI = {
    rinkeby: 'https://rinkeby.etherscan.io',
    bscTestnet: 'https://testnet.bscscan.com',
    bsc: 'https://bscscan.com',
  }

  const contractsParams = [
    {
      name: 'erc721LetsCollect',
      contract: erc721LetsCollect,
      arguments: erc721LetsCollectArgs,
    },
  ]
  await fs.appendFileSync(
    `./deployed.log`,
    `\n## ${networkName} (${new Date()})\n`,
  )

  for (let i = 0; i < contractsParams.length; i++) {
    const params = contractsParams[i]
    console.log(
      `${params.name} deployed to: ${scanURI[networkName]}/address/${params.contract.address}#code`,
    )
    // Write the arguments
    await fs.writeFile(
      `./arguments/argument-${params.name}-${networkName}.ts`,
      `export default ${JSON.stringify(params.arguments)}`,
      (error) => {
        if (error) console.log(error)
      },
    )

    await fs.appendFileSync(
      `./deployed.log`,
      `${params.name}: ${scanURI[networkName]}/address/${params.contract.address}#code\n` +
        `npx hardhat verify --network ${networkName} ${params.contract.address} --constructor-args ./arguments/argument-${params.name}-${networkName}.ts\n`,
    )
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
