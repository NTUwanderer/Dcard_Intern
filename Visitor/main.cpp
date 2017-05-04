#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

int main() {
    size_t n;
    unsigned long long time_period, a_i, d_i;

    vector<unsigned long long> arrivals, departures;
    arrivals.reserve(n);
    departures.reserve(n);

    cin >> time_period >> n;
    for (size_t i = 0; i < n; ++i) {
        cin >> a_i >> d_i;
        arrivals.push_back(a_i);
        departures.push_back(d_i + time_period);
    }
    sort(arrivals.begin(), arrivals.end());
    sort(departures.begin(), departures.end());

    size_t counter = 0, maxCounter = 0;
    vector<unsigned long long>::const_iterator it_a = arrivals.begin();
    vector<unsigned long long>::const_iterator it_d = departures.begin();

    while (it_a != arrivals.end() || it_d != departures.end()) {
        if (it_a != arrivals.end() && it_d != departures.end()) {
            if (*it_a <= *it_d) {
                ++counter;
                ++it_a;
                
                if (counter > maxCounter)
                    maxCounter = counter;
            } else {
                --counter;
                ++it_d;
            }
        } else if (it_a != arrivals.end()) {
            // should not happen
            
            ++counter;
            ++it_a;

            if (counter > maxCounter)
                maxCounter = counter;
        } else {
            --counter;
            ++it_d;
        }
    }

    printf("Maximum number of visitors: %zu \n", maxCounter);

}

