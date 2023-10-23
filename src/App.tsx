import 'diditsdktest/styles.css';
import {
  getDefaultWallets,
  lightTheme,
  DiditAuthProvider,
  DiditRainbowkitProvider,
  DiditAuthMethod,
} from 'diditsdktest';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  zora,
  goerli,
} from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import Home from './Home';

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    mainnet,
    polygon,
    optimism,
    arbitrum,
    base,
    zora,
    ...(import.meta.env.VITE_ENABLE_TESTNETS === 'true' ? [goerli] : []),
  ],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: import.meta.env.VITE_APP_NAME || '',
  projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || '',
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

function App() {
  return (
    <WagmiConfig config={wagmiConfig}>
      <DiditAuthProvider
        authMethods={[DiditAuthMethod.WALLET, DiditAuthMethod.GOOGLE]}
        baseUrl={import.meta.env.VITE_DIDIT_AUTH_BASE_URL || ''}
        clientId={import.meta.env.VITE_DIDIT_CLIENT_ID || ''}
        claims={import.meta.env.VITE_DIDIT_CLAIMS}
        scope={import.meta.env.VITE_DIDIT_SCOPE || ''}
        onLogin={(_authMethod?: DiditAuthMethod) =>
          console.log('Logged in Didit with', _authMethod)
        }
        onLogout={() => console.log('Logged out Didit')}
        onError={(_error: string) => console.error('Didit error: ', _error)}
      >
        <DiditRainbowkitProvider chains={chains} theme={lightTheme()}>
          <Home />
        </DiditRainbowkitProvider>
      </DiditAuthProvider>
    </WagmiConfig>
  );
}

export default App;
