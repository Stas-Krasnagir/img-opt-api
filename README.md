# Description

# Contents

0. [Installation](#Installation)
1. [IMG conversion](#IMG-conversion)

# Installation

```bash
npm i
```

## Start

```
npm run dev
```

[:arrow_up:Contents](#Contents)

# IMG-conversion

### Single image conversion

http://localhost:5000/api/img/single-img-conversion

**POST**

**Body type:**
_form-data_

```
formData: {
      data : file
    }
```

_return Buffer_

### Multiple images conversion

http://localhost:5000/api/img/multiple-img-conversion

**POST**

**Body type:**
_form-data_

```
formData: {
      data : [files],
      archive?: true
    }
```

_return [Buffer`s] if archive? file.zip_

[:arrow_up:Contents](#Contents)
