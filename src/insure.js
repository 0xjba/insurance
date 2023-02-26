import { useEffect, useState } from "react";
import { Contract, providers, utils } from "ethers";
import './insure.css'

const Insure = ({ contractAddress, contractAbi }) => {
    const [isWalletInstalled, setIsWalletInstalled] = useState(false);
    const [account, setAccount] = useState(null);

    // state for keeping track of Policy Details
    const [policyName, setPolicyName] = useState("");
    const [policyEmail, setPolicyEmail] = useState("");
    const [policyCondition, setPolicyCondition] = useState("");
    const [policyExpiry, setPolicyExpiry] = useState(0);
    const [policyClaimed, setPolicyClaimed] = useState(false);
    const [policyReason, setPolicyReason] = useState("");


    // state for keeping track of whether the policy has been bought
    const [policyBought, setPolicyBought] = useState(false);

    //To show policy details
    const [showPolicyDetails, setShowPolicyDetails] = useState(false);
    const handleClick = () => setShowPolicyDetails(!showPolicyDetails);

    //state for keeping track of deployed contract
    const [contract, setContract] = useState(null);

    useEffect(() => {
        const init = async () => {
            const provider = new providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new Contract(contractAddress, contractAbi, signer);
      
            setContract(contract);
            //To store policy details
            const policyDetails = await contract.getPolicyDetails();
            setPolicyName(policyDetails[0]);
            setPolicyEmail(policyDetails[1]);
            setPolicyCondition(policyDetails[2]);
            setPolicyClaimed(policyDetails[5]);
            setPolicyReason(policyDetails[6]);
            setPolicyExpiry(policyDetails[7]);
          };

        if (window.ethereum) {
            init();
            setIsWalletInstalled(true);
        }
    }, [contractAddress, contractAbi]);
    
    async function connectWallet() {
        window.ethereum
            .request({
                method: "eth_requestAccounts",
            })
            .then((accounts) => {
                setAccount(accounts[0]);
            })
            .catch((error) => {
                alert("Something went wrong");
            });
        }

        async function buyPolicy(name, email, healthCondition) {
            try{
            const value = utils.parseEther("0.000000000000000010");
            const tx = await contract.buyPolicy(name, email, healthCondition, { value });
            await tx.wait();

            console.log("Policy bought successfully!");
            alert("Policy bought successfully!");
            setPolicyBought(true);
            } catch(error) {
                alert("Make sure your are on Obscuro n/w & have tokens")
            }
        }

        async function claimPolicy(reason) {
            try {
   
              const tx = await contract.claimPolicy(reason);
              await tx.wait();
            
              setPolicyClaimed(true);
              console.log("Policy claimed successfully!");
              alert("Policy claimed successfully!");
            } catch (error) {
                console.error(error);
                  alert('Claim isnt possible because the medical reason is ineligible');
            }
        }

        if (account === null) {
            return (
                <div className="App">
                    { 
                        isWalletInstalled ? (
                            <button className="button" onClick={connectWallet}>Connect Wallet</button>
                        ) : (
                            <p>Install Metamask wallet</p>
                        )
                    }
                </div>
             );
         }

         if (policyBought || (policyName && policyEmail && policyCondition && policyExpiry)) {
            return (
              <div className="container">
                <h1 className="app_title">Decentralised Insurance App</h1>
                <p className="account_address">ACCOUNT: {account}</p>
                <p className="congratulations_message">Congratulations🥳! You have a policy</p>
                <button className="button" onClick={handleClick}>Get Policy Details</button>
                    {showPolicyDetails && (
                    <div className="PolicyDetails">
                    <p className="details_heading">Details of your policy:</p>
                    <p className="policy_details">NAME: {policyName}</p>
                    <p className="policy_details">EMAIL: {policyEmail}</p>
                    <p className="policy_details">MEDICAL CONDITIONS: {policyCondition}</p>
                    <p className="policy_details">POLICY PURCHASE TIME: {new Date(policyExpiry * 1000).toString()}</p>
                    <p className="policy_details">IS POLICY CLAIMED: {policyClaimed.toString()}</p>
                    <p className="details_heading">Claim Process:</p>
                    {policyClaimed && <p>Claim Reason: {policyReason}</p>}
                    {!policyClaimed && (
                    <form className="policy_form"
                    onSubmit={(e) => {
                        e.preventDefault();
                        claimPolicy(policyReason);
                    }}
                    >
                    <label>
                        Reason:
                        <select className="input_box"
                        value={policyReason}
                        onChange={(e) => setPolicyReason(e.target.value)}
                        >
                        <option value="Anaemia">Anaemia</option>
                        <option value="Accident">Accident</option>
                        <option value="Cancer">Cancer</option>
                        <option value="Pneumonia">Pneumonia</option>
                        <option value="Heart attack">Heart attack</option>
                        <option value="Cosmetic Procedures">Cosmetic Procedures</option>
                        <option value="HIV">HIV</option>
                        <option value="Common Cold">Common Cold</option>
                        <option value="Thyroid">Thyroid</option>
                        <option value="Malaria">Malaria</option>
                        </select>
                    </label>
                    <br/>
                    <button className="button" type="submit">Claim Now</button>
                    </form>
                    )}
                    </div>
                    )}
              </div>
            );
          } else {
              return (
                <div className="container">
                <h1 className="app_title">Decentralised Insurance App</h1>
                <p className="account_address">Account: {account}</p>
                  <h2 className="details_heading">Buy Policy</h2>
                  <form className="policy_Form"
                    onSubmit={(e) => {
                      e.preventDefault();
                      buyPolicy(policyName, policyEmail, policyCondition);
                    }}
                  >
                    <label className="policy_details">
                      Name:
                      <input className="input_box"
                        type="text"
                        value={policyName}
                        onChange={(e) => setPolicyName(e.target.value)}
                      />
                    </label>
                    <br />
                    <label className="policy_details">
                      Email:
                      <input className="input_box"
                        type="email"
                        value={policyEmail}
                        onChange={(e) => setPolicyEmail(e.target.value)}
                      />
                    </label>
                    <br />
                    <label className="policy_details">
                      Health Condition:
                      <input className="input_box"
                        type="text"
                        value={policyCondition}
                        onChange={(e) => setPolicyCondition(e.target.value)}
                      />
                    </label>
                    <br />
                    <button className="button"type="submit">Buy Policy</button>
                  </form>
                </div>
              );
          }
          
         }
export default Insure;
