import React from 'react';
import AvatarRenderer from './components/AvatarRenderer';

export default function TestAvatar() {
    return (
        <div className="p-10 bg-slate-900 min-h-screen text-slate-200">
            <h1 className="text-3xl font-bold mb-8 text-center text-teal-400">Vanguard Avatar Engine - Final Render Validation</h1>
            
            <div className="grid grid-cols-3 gap-8 max-w-6xl mx-auto">
                {/* 1. MALE LAB COAT */}
                <div className="bg-slate-800 p-6 rounded-2xl flex flex-col items-center">
                    <h2 className="text-xl font-semibold mb-6">Dr. Pria (Lab Coat)</h2>
                    <AvatarRenderer 
                        size={240} 
                        avatar={{
                            gender: 'L',
                            skinTone: 'fair',
                            hairColor: 'black',
                            hairStyle: 'neat',
                            outfit: 'labCoat',
                            accessories: ['stethoscope', 'glasses']
                        }}
                        mood="neutral"
                    />
                    <div className="mt-6 text-sm text-slate-400 font-mono">
                        Skin: Fair | Hair: Neat<br/>Outfit: Lab Coat | Acc: Steth, Glasses
                    </div>
                </div>

                {/* 2. FEMALE SCRUBS */}
                <div className="bg-slate-800 p-6 rounded-2xl flex flex-col items-center">
                    <h2 className="text-xl font-semibold mb-6">Dr. Wanita (Scrubs)</h2>
                    <AvatarRenderer 
                        size={240} 
                        avatar={{
                            gender: 'P',
                            skinTone: 'tan',
                            hairColor: 'brown',
                            hairStyle: 'long',
                            outfit: 'scrubs',
                            accessories: ['stethoscope']
                        }}
                        mood="happy"
                    />
                    <div className="mt-6 text-sm text-slate-400 font-mono">
                        Skin: Tan | Hair: Long<br/>Outfit: Scrubs | Acc: Steth
                    </div>
                </div>

                {/* 3. FEMALE HIJAB */}
                <div className="bg-slate-800 p-6 rounded-2xl flex flex-col items-center">
                    <h2 className="text-xl font-semibold mb-6">Dr. Wanita (Hijab)</h2>
                    <AvatarRenderer 
                        size={240} 
                        avatar={{
                            gender: 'P',
                            skinTone: 'medium',
                            hairColor: 'black',
                            hairStyle: 'hijab',
                            outfit: 'labCoat',
                            accessories: ['stethoscope', 'glasses']
                        }}
                        mood="neutral"
                    />
                    <div className="mt-6 text-sm text-slate-400 font-mono">
                        Skin: Med | Hair: Hijab<br/>Outfit: Lab Coat | Acc: Steth, Glasses
                    </div>
                </div>
            </div>
            
            <div className="mt-12 text-center text-slate-500 font-mono text-xs">
                Rendered with Phase 1-6 assembled Vanguard Engine (498 lines of code).
            </div>
        </div>
    );
}
