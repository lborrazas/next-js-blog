import { createContext, useContext, useState } from "react";

const Web3Context = createContext(null);
const SetWeb3Context = createContext(null);

const AddressContext = createContext(null);
const SetAddressContext = createContext(null);

const VmContractContext = createContext(null);
const SetVmContractContext = createContext(null);

export function BlockchainProvider({ children }) {
  const [web3_, setWeb3_] = useState(null);
  const [address, setAddress] = useState(null);
  const [vmContract, setVmContract] = useState(null);

  return (
    <Web3Context.Provider value={web3_}>
      <SetWeb3Context.Provider value={setWeb3_}>
        <AddressContext.Provider value={address}>
          <SetAddressContext.Provider value={setAddress}>
            <VmContractContext.Provider value={vmContract}>
              <SetVmContractContext.Provider value={setVmContract}>
                {children}
              </SetVmContractContext.Provider>
            </VmContractContext.Provider>
          </SetAddressContext.Provider>
        </AddressContext.Provider>
      </SetWeb3Context.Provider>
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  return useContext(Web3Context);
}

export function useSetWeb3() {
  return useContext(SetWeb3Context);
}

export function useAddress() {
  return useContext(AddressContext);
}

export function useSetAddress() {
  return useContext(SetAddressContext);
}

export function useVmContract() {
  return useContext(VmContractContext);
}

export function useSetVmContract() {
  return useContext(SetVmContractContext);
}
