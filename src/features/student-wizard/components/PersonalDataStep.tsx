import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useWizardStore } from "@/stores/useWizardStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { mockStudents } from "@/mocks/students.mock";
import { personalDataSchema } from "@/features/schemas/personalData.schema";

export function PersonalDataStep() {
  const { personalData, setPersonalData, setCurrentStep } = useWizardStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  // Form validation schema (input data structure)
  const formSchema = z.object({
    firstName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    firstSurname: z
      .string()
      .min(2, "El primer apellido debe tener al menos 2 caracteres"),
    secondSurname: z
      .string()
      .min(2, "El segundo apellido debe tener al menos 2 caracteres"),
    studentId: z
      .string()
      .regex(/^[A-Za-z]?\d{8}$/, "Matrícula inválida (ej: A00123456 o 21001122)"),
    program: z.string().min(3, "Selecciona un programa académico"),
  });

  type FormData = z.infer<typeof formSchema>;

  // Descomponer lastName en firstSurname y secondSurname para el formulario
  const decomposedLastName = personalData.lastName.split(" ");
  const defaultFirstSurname = decomposedLastName[0] || "";
  const defaultSecondSurname = decomposedLastName.slice(1).join(" ") || "";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: personalData.firstName,
      firstSurname: defaultFirstSurname,
      secondSurname: defaultSecondSurname,
      studentId: personalData.studentId,
      program: personalData.program,
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (!user || user.role !== "student") return;

    const alreadyFilled =
      personalData.firstName.trim().length > 0 &&
      personalData.lastName.trim().length > 0 &&
      personalData.studentId.trim().length > 0 &&
      personalData.program.trim().length > 0;
    if (alreadyFilled) return;

    const student =
      mockStudents.find((s) => s.id === user.id || s.studentId === user.username) ?? null;

    const fullName = student
      ? `${student.firstName} ${student.lastName}`.trim()
      : user.name;
    const nameParts = fullName.split(" ").filter(Boolean);
    const firstName = student?.firstName ?? nameParts[0] ?? "";
    const lastName = student?.lastName ?? nameParts.slice(1).join(" ");
    const lastNameParts = lastName.split(" ").filter(Boolean);

    const firstSurname = lastNameParts[0] ?? "";
    const secondSurname = lastNameParts.slice(1).join(" ");
    const studentId = student?.studentId ?? user.username;
    const program = student?.enrolledProgram ?? personalData.program;

    reset({
      firstName,
      firstSurname,
      secondSurname,
      studentId,
      program,
    });

    setPersonalData({
      firstName,
      lastName: [firstSurname, secondSurname].filter(Boolean).join(" "),
      studentId,
      program,
    });
  }, [user, personalData, reset, setPersonalData]);

  const onSubmit = (data: FormData) => {
    // Transformar datos del formulario a modelo de almacenamiento
    const transformed = personalDataSchema.parse(data);
    setPersonalData(transformed);
    setCurrentStep(2);
    navigate("/wizard/paso-2");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-2xl mx-auto space-y-6"
    >
      <h2 className="text-2xl font-bold text-gray-900">Datos personales</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Nombre(s)
        </label>
        <input
          type="text"
          {...register("firstName")}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        {errors.firstName && (
          <p className="mt-1 text-sm text-red-600">
            {errors.firstName.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Primer apellido
        </label>
        <input
          type="text"
          {...register("firstSurname")}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        {errors.firstSurname && (
          <p className="mt-1 text-sm text-red-600">
            {errors.firstSurname?.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Segundo apellido
        </label>
        <input
          type="text"
          {...register("secondSurname")}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        {errors.secondSurname && (
          <p className="mt-1 text-sm text-red-600">
            {errors.secondSurname?.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Matrícula
        </label>
        <input
          type="text"
          {...register("studentId")}
          placeholder="Ej: A00123456"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        {errors.studentId && (
          <p className="mt-1 text-sm text-red-600">
            {errors.studentId.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Programa académico
        </label>
        <select
          {...register("program")}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">Selecciona un programa</option>
          <option value="Ingeniería Química">Ingeniería Química</option>
          <option value="Ingeniería Electrónica">Ingeniería Electrónica</option>
          <option value="Ingeniería Mecánica">Ingeniería Mecánica</option>
          <option value="Ingeniería Electrica">Ingeniería Eléctrica</option>
          <option value="Ingeniería Industrial">Ingeniería Industrial</option>
          <option value="Ingeniería en Sistemas Computacionales">
            Ingeniería en Sistemas Computacionales
          </option>
          <option value="Ingeniería en Semiconductores">
            Ingeniería en Semiconductores
          </option>
          <option value="Ingeniería en Informatica">
            Ingeniería en Informática
          </option>
        </select>
        {errors.program && (
          <p className="mt-1 text-sm text-red-600">{errors.program.message}</p>
        )}
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={!isValid}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400"
        >
          Siguiente
        </button>
      </div>
    </form>
  );
}
