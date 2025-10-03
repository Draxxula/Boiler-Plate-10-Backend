// employees/employee.service.js
const db = require('_helpers/db');

module.exports = {
  getAll,
  getById,
  create,
  update,
  transferDepartment,
  basicDetails,
  delete: _delete
};

// Get all employees
async function getAll() {
  return await db.Employee.findAll({
    include: [
      { model: db.Account, attributes: ['id','email', 'role', 'status', 'firstName', 'lastName'] },
      { model: db.Department, as: 'department', attributes: ['id', 'name'] }
    ]
  });
}

// Get employee by ID
async function getById(id) {
  const employee = await db.Employee.findByPk(id, {
    include: [
      { model: db.Account, as: 'account', attributes: ['id','email', 'firstName', 'lastName'] },
      { model: db.Department, as: 'department', attributes: ['id', 'name'] }
    ]
  });

  if (!employee) throw "Employee not found";
  return employee; // <-- return full object, not basicDetails
}

// Create new employee
async function create(params) {
  // Convert IDs to numbers
  params.accountId = Number(params.accountId);
  params.departmentId = Number(params.departmentId);

  // ✅ Make sure account exists
  const account = await db.Account.findByPk(params.accountId);
  if (!account) throw `Account with ID "${params.accountId}" not found`;

  // ✅ Prevent assigning an account that’s already linked
  const existing = await db.Employee.findOne({ where: { accountId: params.accountId } });
  if (existing) throw `Account ID "${params.accountId}" is already assigned to another employee`;

  // ✅ Create employee
  const employee = await db.Employee.create({
    ...params,
    created: Date.now(),
    updated: Date.now()
  });

  return await db.Employee.findByPk(employee.id, {
    include: [
      { model: db.Account, as: 'account', attributes: ['id', 'email', 'firstName', 'lastName'] },
      { model: db.Department, as: 'department', attributes: ['id', 'name'] }
    ]
  });
}

// Update employee
async function update(id, params) {
  const employee = await getEmployee(id);

  // ✅ Prevent assigning the same account to multiple employees
  if (params.accountId && params.accountId !== employee.accountId) {
    const existing = await db.Employee.findOne({ where: { accountId: params.accountId } });
    if (existing) {
      throw `Account ID "${params.accountId}" is already assigned to another employee`;
    }
  }

  // ✅ Optional: keep email uniqueness check if your model has an email field
  if (
    params.email &&
    employee.email !== params.email &&
    (await db.Employee.findOne({ where: { email: params.email } }))
  ) {
    throw `Email "${params.email}" is already taken`;
  }

  Object.assign(employee, params);
  employee.updated = Date.now();

  await employee.save();

  // ✅ Return the updated employee with relations
  return await db.Employee.findByPk(id, {
    include: [
      { model: db.Account, as: 'account', attributes: ['id', 'email', 'firstName', 'lastName'] },
      { model: db.Department, as: 'department', attributes: ['id', 'name'] }
    ]
  });
}


// Delete employee
async function _delete(id) {
  const employee = await getEmployee(id);
  await employee.destroy();
}

// Helpers
async function getEmployee(id) {
  const employee = await db.Employee.findByPk(id);
  if (!employee) throw "Employee not found";
  return employee;
}

// Transfer employee to another department
async function transferDepartment(id, { departmentId }) {
  const employee = await getEmployee(id);
  if (!employee) throw "Employee not found";

  const department = await db.Department.findByPk(departmentId);
  if (!department) throw `Department with ID "${departmentId}" not found`;

  employee.departmentId = departmentId;
  employee.updated = Date.now();

  await employee.save();

  // re-fetch with relations
  return await db.Employee.findByPk(employee.employeeId, {   // ✅ use employeeId
    include: [
      { model: db.Account, as: 'account', attributes: ['id', 'email', 'firstName', 'lastName'] },
      { model: db.Department, as: 'department', attributes: ['id', 'name'] }
    ]
  });
}

function basicDetails(employee) {
  const { id, employeeId, email, position, hireDate, department } = employee;
  return { id, employeeId, email, position, hireDate, department };
}