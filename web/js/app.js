var grid = [
    [0, 0, 0, 5, 6, 9, 2, 4, 7],
    [0, 0, 9, 8, 0, 4, 0, 6, 3],
    [4, 6, 2, 0, 3, 7, 8, 0, 9],
    [0, 8, 0, 0, 0, 6, 7, 0, 4],
    [3, 9, 4, 7, 8, 2, 0, 0, 0],
    [0, 7, 6, 9, 4, 1, 3, 0, 0],
    [6, 1, 7, 0, 9, 0, 4, 3, 8],
    [0, 0, 5, 0, 7, 3, 9, 0, 0],
    [0, 2, 0, 4, 1, 0, 0, 7, 5]
]

class SudocuSolver {

    createList(lnt, type = 0) {
        var res = []
        for (let n = 0; n < lnt; n++)
            type ? res.push(new Set()) : res.push({})
        return res
    }
    getBlockNumber(x) {
        return Math.floor(x / 3)
    }
    /**
     * 
     * @param {number[][]} grid 
     */
    constructor(grid) {
        this.grid = grid

        //claims

        this.claimGrid = new Array(9).fill(0).map(x => this.createList(9, 1))
        this.rowWiseClaimCounter = this.createList(9)
        this.columnWiseClaimCounter = this.createList(9)
        this.boxWiseClaimCounter = new Array(3).fill(0).map(x => this.createList(3))

        //existing

        this.rowWiseExistence = this.createList(9, 1)
        this.columnWiseExistence = this.createList(9, 1)
        this.boxWiseExistence = new Array(3).fill(0).map(x => this.createList(3, 1))

        this.updateExisting()
        this.initClaim()
        this.startFilling()

    }
    // major methods
    updateExisting() {
        for (let n = 0; n < 9; n++) {
            for (let k = 0; k < 9; k++) {
                if (this.grid[n][k]) {
                    var cur = this.grid[n][k]
                    this.rowWiseExistence[n].add(cur)
                    this.columnWiseExistence[k].add(cur)
                    this.boxWiseExistence[this.getBlockNumber(
                        n)][this.getBlockNumber(k)].add(cur)
                }
            }
        }
    }
    initClaim() {
        for (let n = 0; n < 9; n++) {
            for (let k = 0; k < 9; k++) {
                if (this.grid[n][k] == 0) {
                    for (let val = 1; val <= 9; val++) {
                        if (this.canClaim(n, k, val)) {
                            this.updateClaim(n, k, val, 1)
                        }
                    }
                    if ([...this.claimGrid[n][k]].length == 1) {
                        var elm = [...this.claimGrid[n][k]]
                        this.fillCell(n, k, elm[0])
                    }
                }
            }
        }
    }

    startFilling() {
        while (1) {
            var hasFound = 0
            for (let n = 0; n < 9; n++) {
                for (let k = 0; k < 9; k++) {
                    if (!this.grid[n][k]) {
                        var temp = [...this.claimGrid[n][k]]
                        for (let val of temp) {
                            if (this.canFillCell(n, k, val)) {
                                hasFound = 1
                                this.fillCell(n, k, val)
                                break
                            }
                        }
                    }
                }
            }
            if (!hasFound) return
        }
    }

    //utility methods
    canClaim(x, y, val) {
        if (this.rowWiseExistence[x].has(val)) return false
        if (this.columnWiseExistence[y].has(val)) return false
        if (this.boxWiseExistence[this.getBlockNumber(x)][this.getBlockNumber(y)].has(val))
            return false
        return true
    }
    updateClaimCounter(x, y, val, type = -1) {
        this.rowWiseClaimCounter[x][val] += type
        this.columnWiseClaimCounter[y][val] += type
        this.boxWiseClaimCounter[this.getBlockNumber(
            x)][this.getBlockNumber(y)][val] += type
    }

    updateClaim(x, y, val, type = 1) {
        if (type == 1) {
            this.claimGrid[x][y].add(val)
            if (!this.rowWiseClaimCounter[x][val])
                this.rowWiseClaimCounter[x][val] = 0

            if (!this.columnWiseClaimCounter[x][val])
                this.columnWiseClaimCounter[y][val] = 0

            if (!this.boxWiseClaimCounter[this.getBlockNumber(x)][this.getBlockNumber(y)][val])
                this.boxWiseClaimCounter[this.getBlockNumber(
                    x)][this.getBlockNumber(y)][val] = 0
        }
        else
            this.claimGrid[x][y].delete(val)
        this.updateClaimCounter(x, y, val, type)
    }
    canFillCell(x, y, val) {
        if (!this.claimGrid[x][y].has(val)) return false
        if ([...this.claimGrid[x][y]].length == 1) return true
        if (this.rowWiseClaimCounter[x][val] == 1) return true
        if (this.columnWiseClaimCounter[y][val] == 1) return true
        if (this.boxWiseClaimCounter[this.getBlockNumber(x)][this.getBlockNumber(y)][val] == 1) return true
        return false
    }
    fillCell(x, y, val) {
        this.grid[x][y] = val

        this.rowWiseExistence[x].add(val)
        this.columnWiseExistence[y].add(val)
        this.boxWiseExistence[this.getBlockNumber(
            x)][this.getBlockNumber(y)].add(val)

        this.removeClaim(x, y)
    }
    removeClaim(x, y) {
        var otherClaims = [...this.claimGrid[x][y]]
        for (let n of otherClaims) {
            this.removeClaimUtil(x, y, n)
        }
        this.claimGrid[x][y] = new Set()
    }
    getRange(x) {
        var res = [[0, 1, 2], [3, 4, 5], [6, 7, 8]]
        return res[this.getBlockNumber(x)]
    }
    removeClaimUtil(x, y, val) {
        for (let n = 0; n < 9; n++) {
            if (this.claimGrid[x][n].has(val)) {
                this.updateClaim(x, n, val, -1)
            }
            if (this.claimGrid[n][y].has(val)) {
                this.updateClaim(n, y, val, -1)
            }
        }
        for (let n of this.getRange(x)) {
            for (let k of this.getRange(y)) {
                if (this.claimGrid[n][k].has(val)) {
                    this.updateClaim(n, k, val, -1)
                }
            }
        }
    }
}

var solution = new SudocuSolver(grid)
console.log(solution.grid);