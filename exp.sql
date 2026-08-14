CREATE TYPE lead_status AS ENUM ('new', 'converted', 'rejected');

CREATE TYPE attendance_status AS ENUM ('present', 'absent');

CREATE TYPE staff_status AS ENUM ('present', 'excused_absence', 'unexcused_absence');

CREATE TYPE payroll_status AS ENUM ('draft', 'confirmed', 'paid');

CREATE TYPE employee_role AS ENUM ('trainer', 'sale', 'accountant', 'manager', 'admin');

CREATE    TABLE "source" (
          id BIGSERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          color TEXT,
          icon TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW (),
          created_by BIGINT,
          updated_at TIMESTAMPTZ,
          updated_by BIGINT,
          deleted_at TIMESTAMPTZ,
          deleted_by BIGINT,
          is_active BOOLEAN DEFAULT TRUE
          );

CREATE    TABLE employee (
          id BIGSERIAL PRIMARY KEY,
          first_name TEXT NOT NULL,
          last_name TEXT NOT NULL,
          POSITION TEXT,
          role employee_role NOT NULL,
          phone TEXT,
          salary INTEGER NOT NULL DEFAULT 0,
          commission_rate INTEGER NOT NULL DEFAULT 0,
          dependents BIGINT NOT NULL DEFAULT 0,
          created_at TIMESTAMPTZ DEFAULT NOW (),
          created_by BIGINT,
          updated_at TIMESTAMPTZ,
          updated_by BIGINT,
          deleted_at TIMESTAMPTZ,
          deleted_by BIGINT,
          is_active BOOLEAN DEFAULT TRUE
          );

CREATE    TABLE classe (
          id BIGSERIAL PRIMARY KEY,
          trainer_id BIGINT, -- employee_id
          code TEXT NOT NULL UNIQUE,
          name TEXT,
          schedule TEXT,
          tuition INTEGER NOT NULL DEFAULT 0,
          created_at TIMESTAMPTZ DEFAULT NOW (),
          created_by BIGINT,
          updated_at TIMESTAMPTZ,
          updated_by BIGINT,
          deleted_at TIMESTAMPTZ,
          deleted_by BIGINT,
          is_active BOOLEAN DEFAULT TRUE
          );

CREATE    TABLE "lead" (
          id BIGSERIAL PRIMARY KEY,
          seller_id BIGINT,
          first_name TEXT NOT NULL,
          last_name TEXT NOT NULL,
          phone TEXT,
          source_id BIGINT,
          purpose TEXT, -- Mục đích học
          who TEXT,
          status lead_status NOT NULL DEFAULT 'new',
          rejection_reason TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW (),
          created_by BIGINT,
          updated_at TIMESTAMPTZ,
          updated_by BIGINT,
          deleted_at TIMESTAMPTZ,
          deleted_by BIGINT,
          is_active BOOLEAN DEFAULT TRUE
          );

CREATE    TABLE student (
          id BIGSERIAL PRIMARY KEY,
          lead_id BIGINT UNIQUE,
          first_name TEXT NOT NULL,
          last_name TEXT NOT NULL,
          phone TEXT,
          revenue INTEGER NOT NULL DEFAULT 0,
          enrolled_at TIMESTAMPTZ,
          created_at TIMESTAMPTZ DEFAULT NOW (),
          created_by BIGINT,
          updated_at TIMESTAMPTZ,
          updated_by BIGINT,
          deleted_at TIMESTAMPTZ,
          deleted_by BIGINT,
          is_active BOOLEAN DEFAULT TRUE
          );

CREATE    TABLE student_attendance (
          id BIGSERIAL PRIMARY KEY,
          class_id BIGINT NOT NULL,
          student_id BIGINT NOT NULL,
          DATE DATE NOT NULL,
          status attendance_status NOT NULL,
          note TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW (),
          created_by BIGINT,
          updated_at TIMESTAMPTZ,
          updated_by BIGINT,
          deleted_at TIMESTAMPTZ,
          deleted_by BIGINT,
          is_active BOOLEAN DEFAULT TRUE,
          UNIQUE (class_id, student_id, DATE)
          );

CREATE    TABLE staff_attendance (
          id BIGSERIAL PRIMARY KEY,
          employee_id BIGINT NOT NULL,
          DATE DATE NOT NULL,
          status staff_status NOT NULL,
          check_in_time TIME,
          note TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW (),
          created_by BIGINT,
          updated_at TIMESTAMPTZ,
          updated_by BIGINT,
          deleted_at TIMESTAMPTZ,
          deleted_by BIGINT,
          is_active BOOLEAN DEFAULT TRUE,
          UNIQUE (employee_id, DATE)
          );

CREATE    TABLE payroll_record (
          id BIGSERIAL PRIMARY KEY,
          employee_id BIGINT NOT NULL,
          -- kỳ lương
          period DATE NOT NULL,
          -- Snapshot input tại thời điểm tính lương
          base_salary INTEGER NOT NULL,
          dependents_count BIGINT NOT NULL DEFAULT 0,
          commission_rate INTEGER NOT NULL DEFAULT 0,
          -- doanh số & hoa hồng
          sales_revenue INTEGER NOT NULL DEFAULT 0,
          commission INTEGER NOT NULL DEFAULT 0,
          gross_income INTEGER NOT NULL DEFAULT 0,
          -- bảo hiểm (10.5% trên lương cơ bản)
          bhxh INTEGER NOT NULL DEFAULT 0, -- 8%
          bhtn INTEGER NOT NULL DEFAULT 0, -- 1%
          bhyt INTEGER NOT NULL DEFAULT 0, -- 1.5%
          total_insurance INTEGER NOT NULL DEFAULT 0,
          -- giảm trừ gia cảnh
          personal_deduction INTEGER NOT NULL DEFAULT 15500000,
          dependent_deduction INTEGER NOT NULL DEFAULT 0,
          total_relief INTEGER NOT NULL DEFAULT 0,
          -- thuế TNCN
          taxable_income INTEGER NOT NULL DEFAULT 0,
          pit_tax INTEGER NOT NULL DEFAULT 0,
          net_salary INTEGER NOT NULL DEFAULT 0,
          status payroll_status NOT NULL DEFAULT 'draft',
          paid_at TIMESTAMPTZ,
          created_at TIMESTAMPTZ DEFAULT NOW (),
          created_by BIGINT,
          updated_at TIMESTAMPTZ,
          updated_by BIGINT,
          deleted_at TIMESTAMPTZ,
          deleted_by BIGINT,
          is_active BOOLEAN DEFAULT TRUE,
          UNIQUE (employee_id, period)
          );