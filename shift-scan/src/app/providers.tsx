'use client';
// this is the provider for the app, it wraps all the components 
// this is so that all the components can access the context
import {ScanDataProvider} from '../../components/context/ScannedJobSIte';
import {SavedCostCodeProvider} from '../../components/context/SavedCostCode';

export function Providers({ children }: { children: React.ReactNode }) {
    return <>
            <SavedCostCodeProvider>
            <ScanDataProvider>
                {children}
            </ScanDataProvider>
            </SavedCostCodeProvider>
        </>;
}
