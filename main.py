grid = [
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

    def solveSudocu(self):

        return self.grid

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

    def updateClaim(self, x, y, val, type=1):
        if type == 1:
            self.claimGrid[x][y].add(val)
            if val not in self.rowWiseClaimCounter[x]:
                self.rowWiseClaimCounter[x][val] = 0

            if val not in self.columnWiseClaimCounter[y]:
                self.columnWiseClaimCounter[y][val] = 0

            if val not in self.boxWiseClaimCounter[self.getBlockNumber(x)][self.getBlockNumber(y)]:
                self.boxWiseClaimCounter[self.getBlockNumber(
                    x)][self.getBlockNumber(y)][val] = 0
        else:
            self.claimGrid[x][y].remove(val)
        self.updateClaimCounter(x, y, val, type)

    def initClaim(self):
        for n in range(9):
            for k in range(9):
                if self.grid[n][k] == 0:
                    for j in range(1, 10):
                        if self.canClaim(n, k, j):
                            self.updateClaim(n, k, j)
                    if self.claimGrid[n][k].__len__() == 1:
                        elem = list(self.claimGrid[n][k])
                        self.fillCell(n, k, elem[0])

    def startFilling(self):
        attempts = 0
        while 1:
            hasFound = 0
            for n in range(9):
                for k in range(9):
                    if self.grid[n][k] == 0:
                        temp = list(self.claimGrid[n][k].copy())
                        for val in temp:
                            if self.canFillCell(n, k, val):
                                hasFound += 1
                                self.fillCell(n, k, val)
                                break
            if hasFound == 0:
                attempts += 1
                if attempts == 1:
                    break

    def dfs(self, x, y, val):

        self.fillCell(x, y, val)

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

    def updateClaimCounter(self, x, y, val, type=-1):
        self.rowWiseClaimCounter[x][val] += type
        self.columnWiseClaimCounter[y][val] += type
        self.boxWiseClaimCounter[self.getBlockNumber(
            x)][self.getBlockNumber(y)][val] += type

    def removeClaim(self, x, y, val):

        otherClaims = list(self.claimGrid[x][y])

        for n in otherClaims:
            self.removeClaimUtil(x, y, n)
        self.claimGrid[x][y] = set()

    def removeClaimUtil(self, x, y, val):

        for n in range(9):
            if val in self.claimGrid[x][n]:
                self.updateClaim(x, n, val, -1)
            if val in self.claimGrid[n][y]:
                self.updateClaim(n, y, val, -1)
        for n in self.getRange(x):
            for k in self.getRange(y):
                if val in self.claimGrid[n][k]:
                    self.updateClaim(n, k, val, -1)


solution = SudocuSolver(grid)
res = solution.solveSudocu()
print(*res, sep='\n')
