public class InterfaceExample {
    public static void main(String[] args) {
        EmployeeInterface E1 = new Employee("Anjula","Male",24);
        E1.work();
        System.out.println(E1.getname());
        EmployeeInterface E2 = new Manager("Anjula","Male",24,"001");
        E2.work();
        System.out.println(E2.getname());
    }
}
interface EmployeeInterface {
    public void work();
    String getname();
}
class Employee implements EmployeeInterface {
    @Override
    public void work(){
        System.out.println("working");
    }
    String name;
    String Gender;
    int age;
    Employee(String name, String Gender, int age){
        this.name=name;
        this.Gender=Gender;
        this.age=age;
    }
    public String getname(){
        return this.name;
    }
}
class Manager extends Employee implements EmployeeInterface {
    @Override
    public void work(){
        System.out.println("Managing");
    }
    String Mid;
    Manager(String name,String Gender, int age, String Mid){
        super(name,Gender,age);
        this.Mid=Mid;
    }
}
// IBE Commit push test
// IBE Commit push test
