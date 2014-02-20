function permutator (input) {
    var set =[];
    function permute (arr, data) {
        var cur, memo = data || [];
        for (var i = 0; i < arr.length; i++) {
            cur = arr.splice(i, 1)[0];
            if (arr.length === 0) set.push(memo.concat([cur]));
            permute(arr.slice(), memo.concat([cur]));
            arr.splice(i, 0, cur);
        }
        return set;
    }
    return permute(input);
}
function test(arr) {
    if (arr[0] && arr[2] && arr[5] && (arr[0]*10+arr[1])*(arr[2]*100+arr[3]*10+arr[4])==arr[5]*1000+arr[6]*100+arr[7]*10+arr[8])
        console.log(arr);
}

a = permutator([1,2,3,4,5,6,7,8,9,0]);
a.map(test);
