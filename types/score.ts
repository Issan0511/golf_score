// HoleInputTabContentで使用される型定義
export type HoleData = {
  number: number
  par: number
  score: number
  putts: number
  fairwayHit: boolean
  ob1w: number
  obOther: number
  shotCount30: number
  shotCount80: number
  shotCount120: number
  shotCount160: number
  shotCount180: number
  shotCount181plus: number
  shotsuccess30: number
  shotsuccess80: number
  shotsuccess120: number
  shotsuccess160: number
  shotsuccess180: number
  shotsuccess181plus: number
  pinHit: boolean
}

// 親コンポーネントからのprops
export interface HoleInputTabContentProps {
  holes: HoleData[]
  currentHole: number
  submitting: boolean
  handleHoleChange: (field: string, value: any) => void
  goToNextHole: () => void
  goToPrevHole: () => void
  handleSubmit: () => void
  navigateToPrevTab: () => void
  calculateAndUpdatePerformance?: () => void
  navigateToPerformanceTab?: () => void
  setCurrentHole: (holeNumber: number) => void
}

// 子コンポーネントのprops
export interface HoleScoreInputProps {
  hole: HoleData
  handleHoleChange: (field: string, value: any) => void
}

export interface OBInputProps {
  hole: HoleData
  handleHoleChange: (field: string, value: any) => void
}

export interface ApproachShotInputProps {
  hole: HoleData
  handleHoleChange: (field: string, value: any) => void
  handleShotCountChange: (field: string, value: number) => void
  handleShotSuccessChange: (checked: boolean) => void
  getShortestApproachDistance: () => number
  getSuccessValueForCurrentDistance: (distance: number) => number
}

export interface HoleSummaryProps {
  holes: HoleData[]
  currentHole: number
  handleHoleChange: (field: string, value: any) => void
  setCurrentHole: (holeNumber: number) => void
}

export interface NavigationButtonsProps {
  currentHole: number
  submitting: boolean
  navigateToPrevTab: () => void
  navigateToPerformanceTab?: () => void
  handleCompleteHoleInput: () => void
  handleSubmit: () => void
}