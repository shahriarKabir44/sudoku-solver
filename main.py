grid = [
    [0, 0, 8, 0, 3, 0, 2, 0, 5],
    [5, 0, 4, 0, 0, 2, 7, 0, 0],
    [7, 2, 0, 4, 0, 8, 3, 6, 0],
    [4, 7, 0, 0, 0, 3, 0, 2, 6],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [8, 9, 0, 7, 0, 0, 0, 1, 3],
    [0, 5, 1, 3, 0, 9, 0, 7, 4],
    [0, 0, 7, 6, 0, 0, 1, 0, 2],
    [6, 0, 3, 0, 7, 0, 8, 0, 0]
]


class SudocuSolver:
    def __init__(self, grid) -> None:
        self.grid = grid

        # claims
        self.claimGrid = [[set() for n in range(9)] for k in range(9)]
        self.rowWiseClaimCounter = [{} for n in range(9)]
        self.columnWiseClaimCounter = [{} for n in range(9)]
        self.boxWiseClaimCounter = [[{} for n in range(3)] for n in range(3)]

        # existing

        self.rowWiseExistence = [set() for n in range(9)]
        self.columnWiseExistence = [set() for n in range(9)]
        self.boxWiseExistence = [[set() for n in range(3)] for k in range(3)]

        self.updateExisting()
        self.initClaim()
        self.startFilling()

    def getBlockNumber(self, x):
        return x//3

    def updateExisting(self):
        for n in range(9):
            for k in range(9):
                if self.grid[n][k]:
                    cur = self.grid[n][k]
                    self.rowWiseExistence[n].add(cur)
                    self.columnWiseExistence[k].add(cur)
                    self.boxWiseExistence[self.getBlockNumber(
                        n)][self.getBlockNumber(k)].add(cur)

    def canClaim(self, x, y, n):
        if n in self.rowWiseExistence[x]:
            return False
        if n in self.columnWiseExistence[y]:
            return False
        if n in self.boxWiseExistence[self.getBlockNumber(x)][self.getBlockNumber(y)]:
            return False
        return True

    def claim(self, x, y, j):
        self.claimGrid[x][y].add(j)
        if j not in self.rowWiseClaimCounter[x]:
            self.rowWiseClaimCounter[x][j] = 0
        self.rowWiseClaimCounter[x][j] += 1

        if j not in self.columnWiseClaimCounter[y]:
            self.columnWiseClaimCounter[y][j] = 0
        self.columnWiseClaimCounter[y][j] += 1

        if j not in self.boxWiseClaimCounter[self.getBlockNumber(x)][self.getBlockNumber(y)]:
            self.boxWiseClaimCounter[self.getBlockNumber(
                x)][self.getBlockNumber(y)][j] = 0
        self.boxWiseClaimCounter[self.getBlockNumber(
            x)][self.getBlockNumber(y)][j] += 1

    def initClaim(self):
        for n in range(9):
            for k in range(9):
                if self.grid[n][k] == 0:
                    for j in range(1, 10):
                        if self.canClaim(n, k, j):
                            self.claim(n, k, j)

    def startFilling(self):
        while 1:
            hasFound = 0
            for n in range(9):
                for k in range(9):
                    if self.grid[n][k] == 0:
                        temp = list(self.claimGrid[n][k].copy())
                        for val in temp:
                            if self.canFillCell(n, k, val):
                                hasFound = 1
                                self.fillCell(n, k, val)
            if not hasFound:
                break

    def canFillCell(self, x, y, val):
        if val not in self.claimGrid[x][y]:
            return False
        if len(list(self.claimGrid[x][y])) == 1:
            return True
        if val in self.rowWiseClaimCounter[x] and self.rowWiseClaimCounter[x][val] == 1:
            return True
        if val in self.columnWiseClaimCounter[y] and self.columnWiseClaimCounter[y][val] == 1:
            return True
        if val in self.boxWiseClaimCounter[self.getBlockNumber(x)][self.getBlockNumber(y)] and self.boxWiseClaimCounter[self.getBlockNumber(x)][self.getBlockNumber(y)] == 1:
            return True
        return False

    def fillCell(self, x, y, val):

        self.grid[x][y] = val

        self.rowWiseExistence[x].add(val)
        self.columnWiseExistence[y].add(val)
        self.boxWiseExistence[self.getBlockNumber(
            x)][self.getBlockNumber(y)].add(val)

        self.removeClaim(x, y, val)

    def getRange(self, x):
        res = [range(3), range(3, 6), range(6, 9)]
        return res[self.getBlockNumber(x)]

    def removeClaim(self, x, y, val):
        self.claimGrid[x][y].remove(val)
        self.rowWiseClaimCounter[x][val] -= 1
        self.columnWiseClaimCounter[y][val] -= 1
        self.boxWiseClaimCounter[self.getBlockNumber(
            x)][self.getBlockNumber(y)][val] -= 1
        for n in range(9):
            if val in self.claimGrid[x][n]:
                self.claimGrid[x][n].remove(val)
            if val in self.claimGrid[n][y]:
                self.claimGrid[n][y].remove(val)
        for n in self.getRange(x):
            for k in self.getRange(y):
                if val in self.claimGrid[n][k]:
                    self.claimGrid[n][k].remove(val)


solution = SudocuSolver(grid)
print(solution.grid)
