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
// var grid = [
//     [0, 5, 7, 8, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 1, 8, 0],
//     [3, 0, 0, 0, 0, 0, 4, 6, 5],
//     [0, 0, 9, 6, 0, 0, 3, 7, 0],
//     [0, 0, 1, 0, 7, 4, 0, 5, 2],
//     [2, 7, 6, 0, 0, 0, 9, 0, 0],
//     [0, 6, 5, 1, 0, 9, 8, 2, 0],
//     [0, 8, 0, 0, 6, 2, 5, 0, 0],
//     [1, 2, 0, 0, 4, 8, 7, 0, 0]
// ]
var grid = [
    [0, 0, 0, 0, 9, 0, 0, 1, 6],
    [6, 0, 0, 0, 3, 2, 0, 0, 7],
    [2, 0, 0, 7, 0, 0, 0, 5, 3],
    [0, 0, 7, 6, 0, 0, 0, 0, 5],
    [0, 0, 0, 0, 2, 0, 3, 0, 0],
    [0, 4, 0, 0, 1, 5, 7, 0, 0],
    [0, 0, 6, 0, 0, 1, 0, 0, 4],
    [0, 5, 0, 3, 0, 0, 0, 0, 0],
    [0, 0, 3, 0, 5, 0, 0, 8, 0]
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
    createDeepCopy() {
        var self = {}
        self.grid = JSON.parse(JSON.stringify(this.grid))
        self.rowWiseClaimCounter = this.createList(9).map((val, ind) => { return { ...this.rowWiseClaimCounter[ind] } })
        self.columnWiseClaimCounter = this.createList(9).map((val, ind) => { return { ...this.columnWiseClaimCounter[ind] } })
        self.boxWiseClaimCounter = new Array(3).fill(0).map(x => this.createList(3))
        for (let n = 0; n < 3; n++) {
            for (let k = 0; k < 3; k++) {
                self.boxWiseClaimCounter[n][k] = { ...this.boxWiseClaimCounter[n][k] }
            }
        }

        self.claimGrid = new Array(9).fill(0).map(x => this.createList(9, 1))

        for (let n = 0; n < 9; n++) {
            for (let k = 0; k < 9; k++) {
                self.claimGrid[n][k] = new Set([...this.claimGrid[n][k]])
            }
        }

        self.rowWiseExistence = this.createList(9, 1)
        for (let n = 0; n < 9; n++) {
            self.rowWiseExistence[n] = new Set([...this.rowWiseExistence[n]])
        }
        self.columnWiseExistence = this.createList(9, 1)
        for (let n = 0; n < 9; n++) {
            self.columnWiseExistence[n] = new Set([...this.columnWiseExistence[n]])
        }
        self.boxWiseExistence = new Array(3).fill(0).map(x => this.createList(3, 1))
        for (let n = 0; n < 3; n++) {
            for (let k = 0; k < 3; k++) {
                self.boxWiseExistence[n][k] = new Set([...this.boxWiseExistence[n][k]])
            }
        }
        return self
    }
    revertSelf(previousState) {
        this.grid = previousState.grid

        this.claimGrid = previousState.claimGrid
        this.rowWiseClaimCounter = previousState.rowWiseClaimCounter
        this.columnWiseClaimCounter = previousState.columnWiseClaimCounter
        this.boxWiseClaimCounter = previousState.boxWiseClaimCounter


        this.rowWiseExistence = previousState.rowWiseExistence
        this.columnWiseExistence = previousState.columnWiseExistence
        this.boxWiseExistence = previousState.boxWiseExistence
    }

    solve() {

        this.updateExisting()
        this.initClaim()
        this.startFilling()
        return this.grid
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
    findMinimumClaimedCell() {
        var res = 10
        var x = -1
        var y = -1
        for (let n = 0; n < 9; n++) {
            for (let k = 0; k < 9; k++) {
                if (!this.grid[n][k]) {
                    let len = [...this.claimGrid[n][k]].length
                    if (len < res) {
                        res = len
                        x = n
                        y = k
                    }
                }
            }
        }
        return [x, y]
    }
    startFilling() {
        while (1) {
            let hasFound = this.fillupGrid()

            if (!hasFound) {
                if (!this.checkStateValidity()) {
                    this.grid = null
                    return
                }
                if (this.isSolved()) return

                var [guessX, guessY] = this.findMinimumClaimedCell()
                if (guessX == -1) break
                let otherClaims = [...this.claimGrid[guessX][guessY]]
                //otherClaims = otherClaims.reverse()
                var tempSnapShot = this.createDeepCopy()
                for (let claim of otherClaims) {
                    if (this.hitAndTrial(claim, guessX, guessY)) return
                    console.log('trial here');
                    this.revertSelf(tempSnapShot)
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
            var hasFound = this.fillupGrid()
            if (!this.checkStateValidity()) {
                return -1
            }
            if (!hasFound) break
        }
        return (this.isSolved()) ? 1 : 0
    }


    hitAndTrial(guess, x, y) {
        console.log('tiral', x, y, guess);
        var self = this.createDeepCopy()
        this.fillCell(x, y, guess)

        var outcome = this.attempt()
        if (outcome == -1) {
            console.log('invalid guess', x, y, guess);

            this.revertSelf(self)
            return false
        }
        else {
            if (outcome == 1) {
                console.log('valid guess', x, y, guess);
                return true
            }
            else {
                let [n, k] = this.findMinimumClaimedCell()
                if (n == -1 && k == -1) {
                    return true
                }
                let claims = this.claimGrid[n][k]
                for (let claim of claims) {
                    let tempSnapShot = this.createDeepCopy()
                    let canSolve = this.hitAndTrial(claim, n, k)
                    var isPossible = 0
                    if (canSolve) {
                        return true
                    }
                    else {
                        this.revertSelf(tempSnapShot)
                    }
                }
                return false

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
                        console.log(n, k, [...this.claimGrid[n][k]], 'invalid');
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

