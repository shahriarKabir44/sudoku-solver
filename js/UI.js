
var app = angular.module('sudocuApp', [])
app.controller('main', function ($scope) {

    $scope.rangeList = {
        '9': new Array(9).fill(0).map((x, i) => { return i }),
        '3': new Array(3).fill(0).map((x, i) => { return i })
    }

    $scope.grid = []

    $scope.getRange = function (x) {
        var res = [[0, 1, 2], [3, 4, 5], [6, 7, 8]]
        return res[x]
    }
    $scope.gridRange = []
    $scope.currentFocus = {
        x: 1,
        y: 1
    }
    $scope.fillup = function (val) {
        $scope.grid[$scope.currentFocus.x][$scope.currentFocus.y] = val + 1
    }
    $scope.init = function () {
        //$scope.grid = new Array(9).fill(0).map(x => new Array(9).fill(0))
        $scope.grid = [
            [0, 5, 0, 7, 0, 0, 0, 0, 0],
            [0, 0, 9, 3, 0, 0, 2, 7, 6],
            [0, 0, 0, 8, 0, 4, 5, 0, 1],
            [5, 0, 0, 0, 0, 0, 4, 2, 0],
            [0, 0, 0, 5, 0, 8, 0, 0, 0],
            [0, 6, 1, 0, 0, 0, 0, 0, 5],
            [8, 0, 7, 1, 0, 3, 0, 0, 0],
            [9, 1, 6, 0, 0, 0, 3, 0, 0],
            [0, 0, 0, 0, 0, 7, 0, 1, 0]
        ]
        for (let n = 0; n < 9; n++) {
            var temp = []
            for (let k of $scope.getRange(Math.floor(n / 3))) {
                for (let j of $scope.getRange(n % 3)) {
                    let s = { x: k, y: j }
                    temp.push(s)
                }
            }
            $scope.gridRange.push(temp)
        }
        console.log($scope.gridRange)
    }
    $scope.focused = function (cell) {
        $scope.currentFocus.x = cell.x
        $scope.currentFocus.y = cell.y
    }
    window.onkeypress = function (e) {
        var x = e.key * 1
        if (isNaN(x)) return
        $scope.$apply(() => {
            $scope.grid[$scope.currentFocus.x][$scope.currentFocus.y] = x

        })
    }
    $scope.solve = function () {
        var solver = new SudocuSolver($scope.grid)
        $scope.grid = solver.solve()
        console.log($scope.grid);
    }
})