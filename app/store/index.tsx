import { create } from 'zustand'

export type configType = {
    numberOfQuestions:number;
    category:{id:number,name:string},
    level:string;
    type:string;
    status:string;
    score:number;
}

type StoreState = {
    config: configType;
    addLevel: (level: string) => void;
    addNumberOfQuestions: (count: number) => void;
    addCategory: (id: number, name: string) => void;
    addStatus: (status: string) => void;
    addScore: () => void;
    addType: (type: string) => void;
  };

  const defaultConfig: configType = {
    numberOfQuestions: 10,
    category: {
      id: 0,
      name: "",
    },
    level: "",
    type: "",
    status: "",
    score: 0,
  };
  
  const useQuiz = create<StoreState>((set) => ({
    config: { ...defaultConfig },
    addLevel: (level: string) => set((state) => ({ config: { ...state.config, level } })),
    addNumberOfQuestions: (count: number) => set((state) => ({ config: { ...state.config, numberOfQuestions: count } })),
    addCategory: (id: number, name: string) => set((state) => ({ config: { ...state.config, category: { id, name } } })),
    addStatus: (status: string) => set((state) => ({ config: { ...state.config, status } })),
    addScore: () => set((state) => ({ config: { ...state.config, score: state.config.score + 1 } })),
    addType: (type: string) => set((state) => ({ config: { ...state.config, type } })),
  }));
  
  export default useQuiz;
  