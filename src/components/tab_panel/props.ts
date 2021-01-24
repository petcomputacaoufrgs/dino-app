export interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

export default interface DinoTabPanelProps {
  valueTab: number
  setValueTab: React.Dispatch<React.SetStateAction<number>>
  panels: { name: string, Component: React.ReactNode }[]
}