%global gdc_prefix /opt

%define _builddir %(pwd)

%define _rpmfilename %{NAME}-%{VERSION}-%{RELEASE}.%{ARCH}.rpm

# Release tag updates
%define branchname "%{?branch:%(echo %{branch} |sed 's/\.//')}%{!?branch:snapshot}"

Name: gdc-analyze
Version: %{_version}
Release: %{_release}
Summary: GD Analyzer Application

Group: Applications/Productivity
License: Proprietary
URL: http://gooddata.com/
BuildArch: noarch

BuildRoot: %{_tmppath}/%{name}-%{version}-%{release}-root-%(%{__id_u} -n)

Requires: httpd
BuildRequires: npm

%description
%{summary}

%prep

%build
. ci/lib.sh
grunt dist

%install
rm -rf $RPM_BUILD_ROOT

mkdir -p $RPM_BUILD_ROOT%{gdc_prefix}/analyze/
mkdir -p $RPM_BUILD_ROOT%{_sysconfdir}/httpd/conf.d
cp -a dist/* $RPM_BUILD_ROOT%{gdc_prefix}/analyze/

# httpd configuration
install -d $RPM_BUILD_ROOT%{_sysconfdir}/httpd/conf.d
tar -C httpd -cf - . |tar xf - -C \
    $RPM_BUILD_ROOT%{_sysconfdir}/httpd/conf.d

%clean
rm -rf $RPM_BUILD_ROOT

%files
%defattr(0644,root,root,0755)
%{_sysconfdir}/httpd/conf.d/*
%dir %{gdc_prefix}/analyze
%{gdc_prefix}/analyze/*

%changelog
