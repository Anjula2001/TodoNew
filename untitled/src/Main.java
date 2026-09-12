import java.util.Scanner;
public class Main{
    public static void main(String[] args){
        Scanner sc = new Scanner(System.in);
        try{
            System.out.println("Enter Your Age");
            int age = sc.nextInt();
            if (age < 0){
                throw new Exception(" Age cannot be negetive");
            }
            System.out.println("Your age is : "+age);
        }catch(Exception c){
            System.out.println(c.getMessage());
        }finally{
            sc.close();
        }
    }
}
