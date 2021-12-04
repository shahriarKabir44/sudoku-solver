// var grid = [
//     [0, 0, 0, 5, 6, 9, 2, 4, 7],
//     [0, 0, 9, 8, 0, 4, 0, 6, 3],
//     [4, 6, 2, 0, 3, 7, 8, 0, 9],
//     [0, 8, 0, 0, 0, 6, 7, 0, 4],
//     [3, 9, 4, 7, 8, 2, 0, 0, 0],
//     [0, 7, 6, 9, 4, 1, 3, 0, 0],
//     [6, 1, 7, 0, 9, 0, 4, 3, 8],
//     [0, 0, 5, 0, 7, 3, 9, 0, 0],
//     [0, 2, 0, 4, 1, 0, 0, 7, 5]
// ]
var grid = [
    [0, 5, 7, 8, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 8, 0],
    [3, 0, 0, 0, 0, 0, 4, 6, 5],
    [0, 0, 9, 6, 0, 0, 3, 7, 0],
    [0, 0, 1, 0, 7, 4, 0, 5, 2],
    [2, 7, 6, 0, 0, 0, 9, 0, 0],
    [0, 6, 5, 1, 0, 9, 8, 2, 0],
    [0, 8, 0, 0, 6, 2, 5, 0, 0],
    [1, 2, 0, 0, 4, 8, 7, 0, 0]
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



    }
    solve() {
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
                        console.log(n, k, elm[0], 'one');
                        this.fillCell(n, k, elm[0])
                    }
                }
            }
        }
    }

    fillupGrid() {
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
        return hasFound
    }

    startFilling() {
        while (1) {
            console.log('----------------------------------------------------');
            let hasFound = this.fillupGrid()

            if (!hasFound) {
                if (!this.checkStateValidity()) {
                    this.grid = null
                    console.log('object');
                    return
                }
                if (this.isSolved()) return
                for (let n = 0; n < 9; n++) {
                    for (let k = 0; k < 9; k++) {
                        if (!this.grid[n][k]) {
                            let otherClaims = [...this.claimGrid[n][k]]
                            for (let claim of otherClaims) {
                                if (this.hitAndTrial(claim, n, k)) return
                            }
                        }
                    }
                }
                break
            }
        }
    }

    isSolved() {
        for (let n = 0; n < 9; n++) {
            for (let k = 0; k < 9; k++) {
                if (!this.grid[n][k])
                    return false
            }
            if ([...this.rowWiseExistence[n]].length != 9) return false
        }
    }

    attempt() {
        while (1) {
            console.log('object');
            var hasFound = this.fillupGrid()
            if (!this.checkStateValidity()) {
                this.grid = null
                return -1
            }
            if (!hasFound) break
        }
        return (this.isSolved()) ? 1 : 0
    }

    hitAndTrial(guess, x, y) {
        var guesses = this.claimGrid[x][y]
        this.fillCell(x, y, guess)
        var outcome = this.attempt()
        if (outcome == -1) {
            this.grid[x][y] = 0
            for (let n of guesses) {
                this.updateClaim(x, y, n, 1)
            }
            return false
        }
        else {
            if (outcome == 1) {
                return true
            }
            else {
                for (let n = 0; n < 9; n++) {
                    for (let k = 0; k < 9; k++) {
                        if (!this.grid[n][k]) {
                            let claims = this.claimGrid[n][k]
                            for (let claim of claims) {
                                let canSolve = this.hitAndTrial(claim, n, k)
                                if (canSolve) {
                                    return true
                                }
                            }
                        }
                    }
                }
            }
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

            if (!this.columnWiseClaimCounter[y][val])
                this.columnWiseClaimCounter[y][val] = 0

            if (!this.boxWiseClaimCounter[this.getBlockNumber(x)][this.getBlockNumber(y)][val])
                this.boxWiseClaimCounter[this.getBlockNumber(
                    x)][this.getBlockNumber(y)][val] = 0
        }
        else if (type == -1)
            this.claimGrid[x][y].delete(val)
        this.updateClaimCounter(x, y, val, type)
    }
    canFillCell(x, y, val) {
        if (!this.claimGrid[x][y].has(val)) return false
        if ([...this.claimGrid[x][y]].length == 1) {
            console.log(x, y, val, 'one');
            return true
        }
        if (this.rowWiseClaimCounter[x][val] == 1) {
            console.log(x, y, val, 'row');
            return true
        }
        if (this.columnWiseClaimCounter[y][val] == 1) {
            console.log(x, y, val, 'column');
            return true
        }
        if (this.boxWiseClaimCounter[this.getBlockNumber(x)][this.getBlockNumber(y)][val] == 1) {
            console.log(x, y, val, 'box');
            return true
        }
        return false
    }
    fillCell(x, y, val) {
        this.grid[x][y] = val

        this.rowWiseExistence[x].add(val)
        this.columnWiseExistence[y].add(val)
        this.boxWiseExistence[this.getBlockNumber(
            x)][this.getBlockNumber(y)].add(val)

        this.removeClaim(x, y, val)
    }
    removeClaim(x, y, val) {
        var otherClaims = [...this.claimGrid[x][y]]
        for (let n of otherClaims) {
            this.removeClaimUtil(x, y, n, val == n ? -1 : 0)
        }
        this.claimGrid[x][y] = new Set()
    }
    getRange(x) {
        var res = [[0, 1, 2], [3, 4, 5], [6, 7, 8]]
        return res[this.getBlockNumber(x)]
    }
    checkStateValidity() {
        for (let n = 0; n < 9; n++) {
            for (let k = 0; k < 9; k++) {
                if (!this.grid[n][k]) {
                    if (![...this.claimGrid[n][k]].length) {
                        return false
                    }
                }
            }
        }
        return true
    }
    removeClaimUtil(x, y, val, type) {
        for (let n = 0; n < 9; n++) {
            if (this.claimGrid[x][n].has(val)) {
                this.updateClaim(x, n, val, type)
            }
            if (this.claimGrid[n][y].has(val)) {
                this.updateClaim(n, y, val, type)
            }
        }
        for (let n of this.getRange(x)) {
            for (let k of this.getRange(y)) {
                if (this.claimGrid[n][k].has(val)) {
                    this.updateClaim(n, k, val, type)
                }
            }
        }
    }
}

var solver = new SudocuSolver(grid)
solver.solve()
console.log(solver.grid);