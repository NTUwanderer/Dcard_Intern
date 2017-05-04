## Visitor

#### Implement Language
Since the problem is simply a bunch of calculation, I use C++ to implement.<br />
Please let me know if node.js or other languages are required.

#### Assumptions
For simplicity, the data type of time period and arrival / departure time is unsigned long long, which is milliseconds of time.<br />
Since the data type of time is integer, the visitor counts if he/she arrives at the end of chosen time period or he/she departs at the beginning of chosen time period.<br />

#### Algorithm
Given a certain time period t, and a_i / d_i for i_th visitor's arrival / departure time.<br />
The i_th visitor is in the period if and only if the end of chosen period is between (a_i, d_i + t).<br />
Therefore, we maintain two sorted array recording (a_i) and (d_i + t). Set a counter and maxCounter to scan from the earliest arrival / departure to the latest. The counter increases by 1 when arrival, and decreases by 1 when departure. The maxCounter is the maximum value of the counter during the scanning.

#### Time complexity
O(n log n) for sorting the two arrays, and O(n) for reading the inputs and scanning.

#### Test
```bash
$ g++ main.cpp -o main.out
$ main.out < sample_input.txt
```

The standard input should give t (time period), n (number of total visitors), and n pairs of (a_i, d_i).<br />
The output should be "Maximum number of visitors: N ", while N is the result.

