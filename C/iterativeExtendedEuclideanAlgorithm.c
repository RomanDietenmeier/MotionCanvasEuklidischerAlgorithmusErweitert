#define _CRT_SECURE_NO_WARNINGS
#include <stdio.h>
#include <stdlib.h>

int main(int argc, char *argv[])
{
    int i = 1, a, b, aThroughB, aModB = -1, s = 1, t = 0, lastS, lastT, lastAThroughB, lastLastS, lastLastT, lastLastAThroughB, aOriginal, bOriginal;
    a = atoi(argv[1]);
    b = atoi(argv[2]);

    if (b > a)
    {
        int temp = a;
        a = b;
        b = temp;
    }
    aOriginal = a;
    bOriginal = b;

    printf(" i |    a    b |  a/b  a%%b |    s    t\n");
    printf("--------------------------------------\n");
    while (aModB)
    {

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

        aThroughB = a / b;
        aModB = a % b;

        lastLastAThroughB = lastAThroughB;
        lastAThroughB = aThroughB;

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

    int modularMultiplicateInverse = t;
    if (modularMultiplicateInverse < 0)
    {
        printf("Modular inverse %d is negative!\n", modularMultiplicateInverse);
        printf("Thus adding %d to %d\n", aOriginal, modularMultiplicateInverse);
        modularMultiplicateInverse += aOriginal;
    }
    printf("Modular inverse of %d mod %d = %d\n", bOriginal, aOriginal, modularMultiplicateInverse);

    int numberToEncode;
    int encodedNumber;
    while (1)
    {
        printf("Enter number to encode: ");
        scanf("%d", &numberToEncode);
        if (numberToEncode >= aOriginal || (numberToEncode < 0 && numberToEncode <= -aOriginal))
        {
            printf("Number to encode must be less than %d\n", aOriginal);
            continue;
        }
        encodedNumber = (numberToEncode * bOriginal) % aOriginal;
        printf("Encode number:\n");
        printf("%d * %d mod %d = %d\n", numberToEncode, bOriginal, aOriginal, encodedNumber);

        printf("Decode number:\n");
        printf("%d * %d mod %d = %d\n", encodedNumber, modularMultiplicateInverse, aOriginal, (encodedNumber * modularMultiplicateInverse) % aOriginal);
    }

    return 0;
}