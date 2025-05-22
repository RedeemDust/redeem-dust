export const multisendAbi = [
  {
    constant: false,
    inputs: [
      {
        internalType: "bytes",
        name: "transactions",
        type: "bytes",
      },
    ],
    name: "multiSend",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
];
export const erc20Abi = [
    {
        "constant": true,
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_spender",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_from",
                "type": "address"
            },
            {
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "decimals",
        "outputs": [
            {
                "name": "",
                "type": "uint8"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_owner",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "name": "balance",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_owner",
                "type": "address"
            },
            {
                "name": "_spender",
                "type": "address"
            }
        ],
        "name": "allowance",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "payable": true,
        "stateMutability": "payable",
        "type": "fallback"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "spender",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    }
];
export const erc1155Abi = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "account",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "operator",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "bool",
                "name": "approved",
                "type": "bool"
            }
        ],
        "name": "ApprovalForAll",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "operator",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256[]",
                "name": "ids",
                "type": "uint256[]"
            },
            {
                "indexed": false,
                "internalType": "uint256[]",
                "name": "values",
                "type": "uint256[]"
            }
        ],
        "name": "TransferBatch",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "operator",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "TransferSingle",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "string",
                "name": "value",
                "type": "string"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            }
        ],
        "name": "URI",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address[]",
                "name": "accounts",
                "type": "address[]"
            },
            {
                "internalType": "uint256[]",
                "name": "ids",
                "type": "uint256[]"
            }
        ],
        "name": "balanceOfBatch",
        "outputs": [
            {
                "internalType": "uint256[]",
                "name": "",
                "type": "uint256[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "operator",
                "type": "address"
            }
        ],
        "name": "isApprovedForAll",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256[]",
                "name": "ids",
                "type": "uint256[]"
            },
            {
                "internalType": "uint256[]",
                "name": "amounts",
                "type": "uint256[]"
            },
            {
                "internalType": "bytes",
                "name": "data",
                "type": "bytes"
            }
        ],
        "name": "safeBatchTransferFrom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "internalType": "bytes",
                "name": "data",
                "type": "bytes"
            }
        ],
        "name": "safeTransferFrom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "operator",
                "type": "address"
            },
            {
                "internalType": "bool",
                "name": "approved",
                "type": "bool"
            }
        ],
        "name": "setApprovalForAll",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes4",
                "name": "interfaceId",
                "type": "bytes4"
            }
        ],
        "name": "supportsInterface",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "uri",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];
export const ctfAbi = [
    {
       "constant":true,
       "inputs":[
          {
             "name":"owner",
             "type":"address"
          },
          {
             "name":"id",
             "type":"uint256"
          }
       ],
       "name":"balanceOf",
       "outputs":[
          {
             "name":"",
             "type":"uint256"
          }
       ],
       "payable":false,
       "stateMutability":"view",
       "type":"function"
    },
    {
       "constant":true,
       "inputs":[
          {
             "name":"interfaceId",
             "type":"bytes4"
          }
       ],
       "name":"supportsInterface",
       "outputs":[
          {
             "name":"",
             "type":"bool"
          }
       ],
       "payable":false,
       "stateMutability":"view",
       "type":"function"
    },
    {
       "constant":true,
       "inputs":[
          {
             "name":"",
             "type":"bytes32"
          },
          {
             "name":"",
             "type":"uint256"
          }
       ],
       "name":"payoutNumerators",
       "outputs":[
          {
             "name":"",
             "type":"uint256"
          }
       ],
       "payable":false,
       "stateMutability":"view",
       "type":"function"
    },
    {
       "constant":false,
       "inputs":[
          {
             "name":"from",
             "type":"address"
          },
          {
             "name":"to",
             "type":"address"
          },
          {
             "name":"ids",
             "type":"uint256[]"
          },
          {
             "name":"values",
             "type":"uint256[]"
          },
          {
             "name":"data",
             "type":"bytes"
          }
       ],
       "name":"safeBatchTransferFrom",
       "outputs":[

       ],
       "payable":false,
       "stateMutability":"nonpayable",
       "type":"function"
    },
    {
       "constant":true,
       "inputs":[
          {
             "name":"owners",
             "type":"address[]"
          },
          {
             "name":"ids",
             "type":"uint256[]"
          }
       ],
       "name":"balanceOfBatch",
       "outputs":[
          {
             "name":"",
             "type":"uint256[]"
          }
       ],
       "payable":false,
       "stateMutability":"view",
       "type":"function"
    },
    {
       "constant":false,
       "inputs":[
          {
             "name":"operator",
             "type":"address"
          },
          {
             "name":"approved",
             "type":"bool"
          }
       ],
       "name":"setApprovalForAll",
       "outputs":[

       ],
       "payable":false,
       "stateMutability":"nonpayable",
       "type":"function"
    },
    {
       "constant":true,
       "inputs":[
          {
             "name":"",
             "type":"bytes32"
          }
       ],
       "name":"payoutDenominator",
       "outputs":[
          {
             "name":"",
             "type":"uint256"
          }
       ],
       "payable":false,
       "stateMutability":"view",
       "type":"function"
    },
    {
       "constant":true,
       "inputs":[
          {
             "name":"owner",
             "type":"address"
          },
          {
             "name":"operator",
             "type":"address"
          }
       ],
       "name":"isApprovedForAll",
       "outputs":[
          {
             "name":"",
             "type":"bool"
          }
       ],
       "payable":false,
       "stateMutability":"view",
       "type":"function"
    },
    {
       "constant":false,
       "inputs":[
          {
             "name":"from",
             "type":"address"
          },
          {
             "name":"to",
             "type":"address"
          },
          {
             "name":"id",
             "type":"uint256"
          },
          {
             "name":"value",
             "type":"uint256"
          },
          {
             "name":"data",
             "type":"bytes"
          }
       ],
       "name":"safeTransferFrom",
       "outputs":[

       ],
       "payable":false,
       "stateMutability":"nonpayable",
       "type":"function"
    },
    {
       "anonymous":false,
       "inputs":[
          {
             "indexed":true,
             "name":"conditionId",
             "type":"bytes32"
          },
          {
             "indexed":true,
             "name":"oracle",
             "type":"address"
          },
          {
             "indexed":true,
             "name":"questionId",
             "type":"bytes32"
          },
          {
             "indexed":false,
             "name":"outcomeSlotCount",
             "type":"uint256"
          }
       ],
       "name":"ConditionPreparation",
       "type":"event"
    },
    {
       "anonymous":false,
       "inputs":[
          {
             "indexed":true,
             "name":"conditionId",
             "type":"bytes32"
          },
          {
             "indexed":true,
             "name":"oracle",
             "type":"address"
          },
          {
             "indexed":true,
             "name":"questionId",
             "type":"bytes32"
          },
          {
             "indexed":false,
             "name":"outcomeSlotCount",
             "type":"uint256"
          },
          {
             "indexed":false,
             "name":"payoutNumerators",
             "type":"uint256[]"
          }
       ],
       "name":"ConditionResolution",
       "type":"event"
    },
    {
       "anonymous":false,
       "inputs":[
          {
             "indexed":true,
             "name":"stakeholder",
             "type":"address"
          },
          {
             "indexed":false,
             "name":"collateralToken",
             "type":"address"
          },
          {
             "indexed":true,
             "name":"parentCollectionId",
             "type":"bytes32"
          },
          {
             "indexed":true,
             "name":"conditionId",
             "type":"bytes32"
          },
          {
             "indexed":false,
             "name":"partition",
             "type":"uint256[]"
          },
          {
             "indexed":false,
             "name":"amount",
             "type":"uint256"
          }
       ],
       "name":"PositionSplit",
       "type":"event"
    },
    {
       "anonymous":false,
       "inputs":[
          {
             "indexed":true,
             "name":"stakeholder",
             "type":"address"
          },
          {
             "indexed":false,
             "name":"collateralToken",
             "type":"address"
          },
          {
             "indexed":true,
             "name":"parentCollectionId",
             "type":"bytes32"
          },
          {
             "indexed":true,
             "name":"conditionId",
             "type":"bytes32"
          },
          {
             "indexed":false,
             "name":"partition",
             "type":"uint256[]"
          },
          {
             "indexed":false,
             "name":"amount",
             "type":"uint256"
          }
       ],
       "name":"PositionsMerge",
       "type":"event"
    },
    {
       "anonymous":false,
       "inputs":[
          {
             "indexed":true,
             "name":"redeemer",
             "type":"address"
          },
          {
             "indexed":true,
             "name":"collateralToken",
             "type":"address"
          },
          {
             "indexed":true,
             "name":"parentCollectionId",
             "type":"bytes32"
          },
          {
             "indexed":false,
             "name":"conditionId",
             "type":"bytes32"
          },
          {
             "indexed":false,
             "name":"indexSets",
             "type":"uint256[]"
          },
          {
             "indexed":false,
             "name":"payout",
             "type":"uint256"
          }
       ],
       "name":"PayoutRedemption",
       "type":"event"
    },
    {
       "anonymous":false,
       "inputs":[
          {
             "indexed":true,
             "name":"operator",
             "type":"address"
          },
          {
             "indexed":true,
             "name":"from",
             "type":"address"
          },
          {
             "indexed":true,
             "name":"to",
             "type":"address"
          },
          {
             "indexed":false,
             "name":"id",
             "type":"uint256"
          },
          {
             "indexed":false,
             "name":"value",
             "type":"uint256"
          }
       ],
       "name":"TransferSingle",
       "type":"event"
    },
    {
       "anonymous":false,
       "inputs":[
          {
             "indexed":true,
             "name":"operator",
             "type":"address"
          },
          {
             "indexed":true,
             "name":"from",
             "type":"address"
          },
          {
             "indexed":true,
             "name":"to",
             "type":"address"
          },
          {
             "indexed":false,
             "name":"ids",
             "type":"uint256[]"
          },
          {
             "indexed":false,
             "name":"values",
             "type":"uint256[]"
          }
       ],
       "name":"TransferBatch",
       "type":"event"
    },
    {
       "anonymous":false,
       "inputs":[
          {
             "indexed":true,
             "name":"owner",
             "type":"address"
          },
          {
             "indexed":true,
             "name":"operator",
             "type":"address"
          },
          {
             "indexed":false,
             "name":"approved",
             "type":"bool"
          }
       ],
       "name":"ApprovalForAll",
       "type":"event"
    },
    {
       "anonymous":false,
       "inputs":[
          {
             "indexed":false,
             "name":"value",
             "type":"string"
          },
          {
             "indexed":true,
             "name":"id",
             "type":"uint256"
          }
       ],
       "name":"URI",
       "type":"event"
    },
    {
       "constant":false,
       "inputs":[
          {
             "name":"oracle",
             "type":"address"
          },
          {
             "name":"questionId",
             "type":"bytes32"
          },
          {
             "name":"outcomeSlotCount",
             "type":"uint256"
          }
       ],
       "name":"prepareCondition",
       "outputs":[

       ],
       "payable":false,
       "stateMutability":"nonpayable",
       "type":"function"
    },
    {
       "constant":false,
       "inputs":[
          {
             "name":"questionId",
             "type":"bytes32"
          },
          {
             "name":"payouts",
             "type":"uint256[]"
          }
       ],
       "name":"reportPayouts",
       "outputs":[

       ],
       "payable":false,
       "stateMutability":"nonpayable",
       "type":"function"
    },
    {
       "constant":false,
       "inputs":[
          {
             "name":"collateralToken",
             "type":"address"
          },
          {
             "name":"parentCollectionId",
             "type":"bytes32"
          },
          {
             "name":"conditionId",
             "type":"bytes32"
          },
          {
             "name":"partition",
             "type":"uint256[]"
          },
          {
             "name":"amount",
             "type":"uint256"
          }
       ],
       "name":"splitPosition",
       "outputs":[

       ],
       "payable":false,
       "stateMutability":"nonpayable",
       "type":"function"
    },
    {
       "constant":false,
       "inputs":[
          {
             "name":"collateralToken",
             "type":"address"
          },
          {
             "name":"parentCollectionId",
             "type":"bytes32"
          },
          {
             "name":"conditionId",
             "type":"bytes32"
          },
          {
             "name":"partition",
             "type":"uint256[]"
          },
          {
             "name":"amount",
             "type":"uint256"
          }
       ],
       "name":"mergePositions",
       "outputs":[

       ],
       "payable":false,
       "stateMutability":"nonpayable",
       "type":"function"
    },
    {
       "constant":false,
       "inputs":[
          {
             "name":"collateralToken",
             "type":"address"
          },
          {
             "name":"parentCollectionId",
             "type":"bytes32"
          },
          {
             "name":"conditionId",
             "type":"bytes32"
          },
          {
             "name":"indexSets",
             "type":"uint256[]"
          }
       ],
       "name":"redeemPositions",
       "outputs":[

       ],
       "payable":false,
       "stateMutability":"nonpayable",
       "type":"function"
    },
    {
       "constant":true,
       "inputs":[
          {
             "name":"conditionId",
             "type":"bytes32"
          }
       ],
       "name":"getOutcomeSlotCount",
       "outputs":[
          {
             "name":"",
             "type":"uint256"
          }
       ],
       "payable":false,
       "stateMutability":"view",
       "type":"function"
    },
    {
       "constant":true,
       "inputs":[
          {
             "name":"oracle",
             "type":"address"
          },
          {
             "name":"questionId",
             "type":"bytes32"
          },
          {
             "name":"outcomeSlotCount",
             "type":"uint256"
          }
       ],
       "name":"getConditionId",
       "outputs":[
          {
             "name":"",
             "type":"bytes32"
          }
       ],
       "payable":false,
       "stateMutability":"pure",
       "type":"function"
    },
    {
       "constant":true,
       "inputs":[
          {
             "name":"parentCollectionId",
             "type":"bytes32"
          },
          {
             "name":"conditionId",
             "type":"bytes32"
          },
          {
             "name":"indexSet",
             "type":"uint256"
          }
       ],
       "name":"getCollectionId",
       "outputs":[
          {
             "name":"",
             "type":"bytes32"
          }
       ],
       "payable":false,
       "stateMutability":"view",
       "type":"function"
    },
    {
       "constant":true,
       "inputs":[
          {
             "name":"collateralToken",
             "type":"address"
          },
          {
             "name":"collectionId",
             "type":"bytes32"
          }
       ],
       "name":"getPositionId",
       "outputs":[
          {
             "name":"",
             "type":"uint256"
          }
       ],
       "payable":false,
       "stateMutability":"pure",
       "type":"function"
    }
 ];
export const negRiskAdapterAbi = [{"inputs":[{"internalType":"address","name":"_ctf","type":"address"},{"internalType":"address","name":"_collateral","type":"address"},{"internalType":"address","name":"_vault","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"DeterminedFlagAlreadySet","type":"error"},{"inputs":[],"name":"FeeBipsOutOfBounds","type":"error"},{"inputs":[],"name":"IndexOutOfBounds","type":"error"},{"inputs":[],"name":"InvalidIndexSet","type":"error"},{"inputs":[],"name":"LengthMismatch","type":"error"},{"inputs":[],"name":"MarketAlreadyDetermined","type":"error"},{"inputs":[],"name":"MarketAlreadyPrepared","type":"error"},{"inputs":[],"name":"MarketNotPrepared","type":"error"},{"inputs":[],"name":"NoConvertiblePositions","type":"error"},{"inputs":[],"name":"NotAdmin","type":"error"},{"inputs":[],"name":"NotApprovedForAll","type":"error"},{"inputs":[],"name":"OnlyOracle","type":"error"},{"inputs":[],"name":"UnexpectedCollateralToken","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"marketId","type":"bytes32"},{"indexed":true,"internalType":"address","name":"oracle","type":"address"},{"indexed":false,"internalType":"uint256","name":"feeBips","type":"uint256"},{"indexed":false,"internalType":"bytes","name":"data","type":"bytes"}],"name":"MarketPrepared","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"admin","type":"address"},{"indexed":true,"internalType":"address","name":"newAdminAddress","type":"address"}],"name":"NewAdmin","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"marketId","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"questionId","type":"bytes32"},{"indexed":false,"internalType":"bool","name":"outcome","type":"bool"}],"name":"OutcomeReported","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"redeemer","type":"address"},{"indexed":true,"internalType":"bytes32","name":"conditionId","type":"bytes32"},{"indexed":false,"internalType":"uint256[]","name":"amounts","type":"uint256[]"},{"indexed":false,"internalType":"uint256","name":"payout","type":"uint256"}],"name":"PayoutRedemption","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"stakeholder","type":"address"},{"indexed":true,"internalType":"bytes32","name":"conditionId","type":"bytes32"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"PositionSplit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"stakeholder","type":"address"},{"indexed":true,"internalType":"bytes32","name":"marketId","type":"bytes32"},{"indexed":true,"internalType":"uint256","name":"indexSet","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"PositionsConverted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"stakeholder","type":"address"},{"indexed":true,"internalType":"bytes32","name":"conditionId","type":"bytes32"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"PositionsMerge","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"marketId","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"questionId","type":"bytes32"},{"indexed":false,"internalType":"uint256","name":"index","type":"uint256"},{"indexed":false,"internalType":"bytes","name":"data","type":"bytes"}],"name":"QuestionPrepared","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"admin","type":"address"},{"indexed":true,"internalType":"address","name":"removedAdmin","type":"address"}],"name":"RemovedAdmin","type":"event"},{"inputs":[],"name":"FEE_DENOMINATOR","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"NO_TOKEN_BURN_ADDRESS","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"admin","type":"address"}],"name":"addAdmin","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"admins","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_owner","type":"address"},{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address[]","name":"_owners","type":"address[]"},{"internalType":"uint256[]","name":"_ids","type":"uint256[]"}],"name":"balanceOfBatch","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"col","outputs":[{"internalType":"contract ERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_marketId","type":"bytes32"},{"internalType":"uint256","name":"_indexSet","type":"uint256"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"convertPositions","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"ctf","outputs":[{"internalType":"contract IConditionalTokens","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_questionId","type":"bytes32"}],"name":"getConditionId","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_marketId","type":"bytes32"}],"name":"getDetermined","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_marketId","type":"bytes32"}],"name":"getFeeBips","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_marketId","type":"bytes32"}],"name":"getMarketData","outputs":[{"internalType":"MarketData","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_marketId","type":"bytes32"}],"name":"getOracle","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_questionId","type":"bytes32"},{"internalType":"bool","name":"_outcome","type":"bool"}],"name":"getPositionId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_marketId","type":"bytes32"}],"name":"getQuestionCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_marketId","type":"bytes32"}],"name":"getResult","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"addr","type":"address"}],"name":"isAdmin","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_collateralToken","type":"address"},{"internalType":"bytes32","name":"","type":"bytes32"},{"internalType":"bytes32","name":"_conditionId","type":"bytes32"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"mergePositions","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_conditionId","type":"bytes32"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"mergePositions","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"bytes","name":"","type":"bytes"}],"name":"onERC1155BatchReceived","outputs":[{"internalType":"bytes4","name":"","type":"bytes4"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"bytes","name":"","type":"bytes"}],"name":"onERC1155Received","outputs":[{"internalType":"bytes4","name":"","type":"bytes4"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_feeBips","type":"uint256"},{"internalType":"bytes","name":"_metadata","type":"bytes"}],"name":"prepareMarket","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_marketId","type":"bytes32"},{"internalType":"bytes","name":"_metadata","type":"bytes"}],"name":"prepareQuestion","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_conditionId","type":"bytes32"},{"internalType":"uint256[]","name":"_amounts","type":"uint256[]"}],"name":"redeemPositions","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"admin","type":"address"}],"name":"removeAdmin","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceAdmin","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_questionId","type":"bytes32"},{"internalType":"bool","name":"_outcome","type":"bool"}],"name":"reportOutcome","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_from","type":"address"},{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_id","type":"uint256"},{"internalType":"uint256","name":"_value","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_collateralToken","type":"address"},{"internalType":"bytes32","name":"","type":"bytes32"},{"internalType":"bytes32","name":"_conditionId","type":"bytes32"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"splitPosition","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_conditionId","type":"bytes32"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"splitPosition","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"vault","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"wcol","outputs":[{"internalType":"contract WrappedCollateral","name":"","type":"address"}],"stateMutability":"view","type":"function"}];