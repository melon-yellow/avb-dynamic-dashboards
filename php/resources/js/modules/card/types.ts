
/*
##########################################################################################################################
*/

export type DatasetType = 'display' | 'table' | 'chart' | 'pie'

export type Dataset<
    T extends DatasetType = DatasetType
> = {
   type: DatasetType 
}

export type DatasetCollection = Record<string, Dataset>

/*
##########################################################################################################################
*/

export type Font = {
    color?: string
    size?: number
}

export type Topnav = {
    color?: string
}

export type Sidenav = {
    color?: string
    display?: boolean 
}

export type Children = (Row | Col | Card)[]
export type Grid = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12

export type Row = {
    type: 'row'
    grid?: Grid
    children?: Children
}

export type Col = {
    type: 'col'
    grid: Grid
    children?: Children
}

export type Card = {
    type: 'card'
    body?: {
        color?: string
    }
    elements?: unknown
}

export type Body = {
    color?: string
    font?: Font
    children?: Children
}

export type Root = {
    type: 'root'
    topnav?: Topnav
    sidenav?: Sidenav
    body?: Body
}

export type Layout = Root | Row | Col | Card 

/*
##########################################################################################################################
*/