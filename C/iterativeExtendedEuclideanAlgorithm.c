#define _CRT_SECURE_NO_WARNINGS
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

void encodeDecodeNumbersInputOutputLoop(int a, int b, int modularMultiplicateInverse);
void encodeDecodeCharactersInputOutputLoop(int a, int b, int modularMultiplicateInverse);

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

    printf("GCD(%d, %d) = %d\n", aOriginal, bOriginal, a);

    if (a != 1)
    {
        printf("Modular multiplicative inverse of %d mod %d does not exist!\n", bOriginal, aOriginal);
        printf("GCD(%d, %d) has to be 1 for the Modular multiplicative inverse to exist!\n", aOriginal, bOriginal);
        return 0;
    }

    int modularMultiplicateInverse = t;
    if (modularMultiplicateInverse < 0)
    {
        printf("Modular inverse %d is negative!\n", modularMultiplicateInverse);
        printf("Thus adding %d to %d\n", aOriginal, modularMultiplicateInverse);
        modularMultiplicateInverse += aOriginal;
    }
    printf("Modular inverse of %d mod %d = %d\n", bOriginal, aOriginal, modularMultiplicateInverse);
    printf("\n");

    if (argc > 3)
    {
        encodeDecodeCharactersInputOutputLoop(aOriginal, bOriginal, modularMultiplicateInverse);
    }
    else
    {
        encodeDecodeNumbersInputOutputLoop(aOriginal, bOriginal, modularMultiplicateInverse);
    }

    return 0;
}

void encodeDecodeNumbersInputOutputLoop(int a, int b, int modularMultiplicateInverse)
{
    int numberToEncode;
    int encodedNumber;
    while (1)
    {
        printf("Enter number to encode: ");
        scanf("%d", &numberToEncode);
        if (numberToEncode >= a || (numberToEncode < 0 && numberToEncode <= -a))
        {
            printf("Number to encode must be less than %d\n", a);
            continue;
        }
        encodedNumber = (numberToEncode * b) % a;
        printf("Encode number:\n");
        printf("%d * %d mod %d = %d\n", numberToEncode, b, a, encodedNumber);

        printf("Decode number:\n");
        printf("%d * %d mod %d = %d\n", encodedNumber, modularMultiplicateInverse, a, (encodedNumber * modularMultiplicateInverse) % a);
        printf("\n");
    }
}

void encodeDecodeCharactersInputOutputLoop(int a, int b, int modularMultiplicateInverse)
{
    char *charactersToEncode = calloc(300, sizeof(char));
    int *encodedCharacters = calloc(300, sizeof(int));
    while (1)
    {
        printf("Enter text to encode:\n");
        scanf("%[^\n]%*c", charactersToEncode);

        for (int i = 0; 300; i++)
        {
            if (charactersToEncode[i] == '\0')
            {
                encodedCharacters[i] = charactersToEncode[i];
                break;
            }
            if (charactersToEncode[i] >= a || (charactersToEncode[i] < 0 && charactersToEncode[i] <= -a))
            {
                printf("Character to encode must be less than %d\n", a);
                encodedCharacters[i] = '\0';
                continue;
            }
            encodedCharacters[i] = ((int)(charactersToEncode[i]) * b) % a;
        }
        printf("Encoded text:\n");
        for (int i = 0; i < 300; i++)
        {
            for (int j = 0; j < sizeof(int); j++)
            {
                int temp = encodedCharacters[i];
                temp <<= 8 * j;
                printf("%c", (char)temp);
            }
        }
        printf("\n");

        printf("Decoded text:\n");
        for (int i = 0; 300; i++)
        {
            if (encodedCharacters[i] == '\0')
            {
                break;
            }
            printf("%c", (encodedCharacters[i] * modularMultiplicateInverse) % a);
        }
        printf("\n");
    }
    free(charactersToEncode);
    free(encodedCharacters);
}