import prisma from "@/lib/prisma";
import { refreshPublicPackages } from "@/lib/publicCache";
import { getAdminSession } from "@/lib/auth";
import { parsePackageForm } from "@/lib/packageFormData";

// ---------------------------------------
// CREATE SLUG
// ---------------------------------------

function createSlug(value = "") {
  return value
    .toString()
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ---------------------------------------
// CREATE UNIQUE SLUG
// ---------------------------------------

async function getUniqueSlug(title) {
  const baseSlug =
    createSlug(title);

  if (!baseSlug) {
    throw new Error(
      "Package title is required."
    );
  }

  let slug = baseSlug;
  let count = 1;

  while (true) {
    const existing =
      await prisma.package.findUnique({
        where: {
          slug,
        },
        select: {
          id: true,
        },
      });

    if (!existing) {
      return slug;
    }

    slug = `${baseSlug}-${count}`;

    count++;
  }
}

// ---------------------------------------
// CREATE PACKAGE
// ---------------------------------------

export async function POST(request) {
  const session =
    await getAdminSession();

  if (!session) {
    return Response.json(
      {
        message: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  try {
    const form =
      await request.formData();

    // Get title before parsing
    const title = form
      .get("title")
      ?.toString()
      .trim();

    if (!title) {
      return Response.json(
        {
          message:
            "Package title is required.",
        },
        {
          status: 400,
        }
      );
    }

    // --------------------------------
    // AUTO GENERATE UNIQUE SLUG
    // --------------------------------

    const slug =
      await getUniqueSlug(
        title
      );

    form.set(
      "slug",
      slug
    );

    // --------------------------------
    // PARSE PACKAGE FORM
    // --------------------------------

    const {
      data,
      itineraries,
      gallery,
    } =
      await parsePackageForm(
        form
      );
      
    const pkg =
      await prisma.package.create({
        data: {
          ...data,

          slug,

          itineraries: {
            create:
              itineraries || [],
          },

          images: {
            create:
              gallery || [],
          },
        },

        include: {
          itineraries: true,
          images: true,
        },
      });

    refreshPublicPackages();
    return Response.json(
      pkg,
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "Create package error:",
      error
    );

    return Response.json(
      {
        message:
          error.message ||
          "Could not create package",
      },
      {
        status: 400,
      }
    );
  }
}
