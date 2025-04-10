export type HoleData = {
  number: number
  par: number
  score: number
  putts: number
  fairwayHit: boolean
  ob1w: number
  obOther: number
  ob_2nd?: number
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

export interface HoleInputProps {
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
}

// 各セクション用のProps定義
export interface ScoreInputSectionProps {
  currentHoleData: HoleData
  handleHoleChange: (field: string, value: any) => void
}

export interface OBInputSectionProps {
  currentHoleData: HoleData
  handleHoleChange: (field: string, value: any) => void
}

export interface ApproachInputSectionProps {
  currentHoleData: HoleData
  handleHoleChange: (field: string, value: any) => void
  handleShotCountChange: (field: string, value: number) => void
  getShortestApproachDistance: () => number
  getSuccessValueForCurrentDistance: (distance: number) => number
  handleShotSuccessChange: (checked: boolean) => void
}

export interface HoleNavigationProps {
  currentHole: number
  totalHoles: number
  goToPrevHole: () => void
  goToNextHole: () => void
}

export interface HoleSummaryProps {
  holes: HoleData[]
  currentHole: number
  handleHoleChange: (field: string, value: any) => void
}