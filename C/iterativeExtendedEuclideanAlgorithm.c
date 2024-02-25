#include <stdio.h>
#include <stdlib.h>

int main(int argc, char *argv[])
{
    int i = 1, a, b, aThroughB, aModB = -1, s = 1, t = 0, lastS, lastT, lastAThroughB, lastLastS, lastLastT, lastLastAThroughB;
    a = atoi(argv[1]);
    b = atoi(argv[2]);

    if (b > a)
    {
        int temp = a;
        a = b;
        b = temp;
    }

    printf(" i |    a    b |  a/b  a%%b |    s    t\n");
    printf("--------------------------------------\n");
    while (aModB)
    {
        lastLastAThroughB = lastAThroughB;
        lastAThroughB = aThroughB;

        aThroughB = a / b;
        aModB = a % b;

        if (i == 1)
        {
            s = 1;
            t = 0;
        }
        else if (i == 2)
        {
            s = 0;
            t = 1;
        }
        else if (i > 2)
        {
            s = lastLastS - lastS * lastLastAThroughB;
            t = lastLastT - lastT * lastLastAThroughB;
        }

        lastLastS = lastS;
        lastS = s;

        lastLastT = lastT;
        lastT = t;

        printf("%2d | %4d %4d | %4d %4d | %4d %4d\n", i, a, b, aThroughB, aModB, s, t);

        a = b;
        b = aModB;
        i++;
    }
    s = lastLastS - lastS * lastLastAThroughB;
    t = lastLastT - lastT * lastLastAThroughB;
    printf("%2d | %4d %4d |    -    - | %4d %4d\n", i, a, b, s, t);
    return 0;
}